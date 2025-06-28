import {
  Subscription,
  SubscriptionCreationAttributes
} from "../models/subscription.model"

export interface ISubscriptionsCommandRepository {
  create(attributes: SubscriptionCreationAttributes): Promise<Subscription>

  confirmByToken(token: string): Promise<Subscription | null>

  unsubscribeByToken(token: string): Promise<void>
}
