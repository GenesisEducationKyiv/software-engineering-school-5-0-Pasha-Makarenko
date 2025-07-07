import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { GetActiveSubscriptionsQuery } from "../impl/get-active-subscriptions.query"
import { Inject } from "@nestjs/common"
import {
  ISubscriptionsQueryRepository,
  SUBSCRIPTIONS_QUERY_REPOSITORY
} from "../../../../domain/subscriptions/repositories/subscriptions-query.repository.interface"
import {
  ITransactionsManager,
  TRANSACTIONS_MANAGER
} from "../../../common/interfaces/transaction.manager"

@QueryHandler(GetActiveSubscriptionsQuery)
export class GetActiveSubscriptionsHandler
  implements IQueryHandler<GetActiveSubscriptionsQuery>
{
  constructor(
    @Inject(SUBSCRIPTIONS_QUERY_REPOSITORY)
    private subscriptionsQueryRepository: ISubscriptionsQueryRepository,
    @Inject(TRANSACTIONS_MANAGER)
    private transactionManager: ITransactionsManager
  ) {}

  async execute(query: GetActiveSubscriptionsQuery) {
    const { frequency } = query

    return await this.transactionManager.transaction(async em => {
      return await this.subscriptionsQueryRepository.findAllActiveByFrequency(
        frequency,
        em
      )
    })
  }
}
