import { QueryHandler } from "../services/cqrs.mock"
import { GetActiveSubscriptionsQuery } from "../../../src/application/subscriptions/queries/impl/get-active-subscriptions.query"
import { Subscription } from "../../../src/domain/subscriptions/entities/subscription.entity"
import { subscriptionsMock } from "../entities/subscription.entity.mock"

export class GetActiveSubscriptionsHandler
  implements QueryHandler<GetActiveSubscriptionsQuery, Subscription[]>
{
  async handle(_query: GetActiveSubscriptionsQuery) {
    return subscriptionsMock
  }
}
