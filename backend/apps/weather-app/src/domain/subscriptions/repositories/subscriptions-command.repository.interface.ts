import { Subscription } from "../entities/subscription.entity"

export const SUBSCRIPTIONS_COMMAND_REPOSITORY =
  "SUBSCRIPTIONS_COMMAND_REPOSITORY"

export interface ISubscriptionsCommandRepository {
  add(subscription: Subscription, transactionEm?: unknown): Promise<void>

  delete(subscription: Subscription, transactionEm?: unknown): Promise<void>
}
