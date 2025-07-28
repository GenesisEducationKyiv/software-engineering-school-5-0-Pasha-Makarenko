import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { GetActiveSubscriptionsQuery } from "../impl/get-active-subscriptions.query"
import { Inject, Logger } from "@nestjs/common"
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
  private readonly logger = new Logger(GetActiveSubscriptionsHandler.name)

  constructor(
    @Inject(SUBSCRIPTIONS_QUERY_REPOSITORY)
    private subscriptionsQueryRepository: ISubscriptionsQueryRepository,
    @Inject(TRANSACTIONS_MANAGER)
    private transactionManager: ITransactionsManager
  ) {}

  async execute(query: GetActiveSubscriptionsQuery) {
    const { frequency } = query

    this.logger.log({
      operation: "getActiveSubscriptions",
      params: query,
      message: "Fetching active subscriptions"
    })

    const result = await this.transactionManager.transaction(async em => {
      return await this.subscriptionsQueryRepository.findAllActiveByFrequency(
        frequency,
        em
      )
    })

    this.logger.log({
      operation: "getActiveSubscriptions",
      params: query,
      result: result.map(sub => sub.id),
      message: "Active subscriptions fetched successfully"
    })

    return result
  }
}
