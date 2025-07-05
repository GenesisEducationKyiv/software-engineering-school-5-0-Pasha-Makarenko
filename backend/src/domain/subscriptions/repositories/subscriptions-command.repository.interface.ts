import { Subscription } from "../entities/subscription.entity"
import { SubscriptionCreation } from "../value-objects/subscription-creation.value-object"

export const SUBSCRIPTIONS_COMMAND_REPOSITORY =
  "SUBSCRIPTIONS_COMMAND_REPOSITORY"

export interface ISubscriptionsCommandRepository {
  create(attributes: SubscriptionCreation): Promise<Subscription>

  update(subscription: Subscription): Promise<Subscription>

  delete(subscriptionId: string): Promise<void>
}
