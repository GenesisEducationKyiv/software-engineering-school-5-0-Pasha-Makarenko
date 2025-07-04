import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { GetActiveSubscriptionsQuery } from "../impl/get-active-subscriptions.query"
import { Inject } from "@nestjs/common"
import { SUBSCRIPTIONS_QUERY_REPOSITORY } from "../../repositories/subscriptions-query.repository"
import { ISubscriptionsQueryRepository } from "../../interfaces/subscriptions-query.repository.interface"

@QueryHandler(GetActiveSubscriptionsQuery)
export class GetActiveSubscriptionsHandler
  implements IQueryHandler<GetActiveSubscriptionsQuery>
{
  constructor(
    @Inject(SUBSCRIPTIONS_QUERY_REPOSITORY)
    private subscriptionsQueryRepository: ISubscriptionsQueryRepository
  ) {}

  async execute(query: GetActiveSubscriptionsQuery) {
    const { frequency } = query

    return this.subscriptionsQueryRepository.findAllActiveByFrequency(frequency)
  }
}
