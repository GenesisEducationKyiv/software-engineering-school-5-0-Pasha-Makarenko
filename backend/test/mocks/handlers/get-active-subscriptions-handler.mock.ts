import { GetActiveSubscriptionsQuery } from "../../../src/subscriptions/queries/impl/get-active-subscriptions.query"
import { Subscription } from "../../../src/subscriptions/models/subscription.model"
import { subscriptionModelsMock } from "../models/subscription.model.mock"
import { QueryHandler } from "../services/cqrs.mock"

export class GetActiveSubscriptionsHandler
  implements QueryHandler<GetActiveSubscriptionsQuery, Subscription[]>
{
  async handle(_query: GetActiveSubscriptionsQuery) {
    return subscriptionModelsMock
  }
}
