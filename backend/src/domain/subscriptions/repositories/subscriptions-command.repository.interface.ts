import { EntityManager } from "@mikro-orm/postgresql"
import { Subscription } from "../entities/subscription.entity"

export const SUBSCRIPTIONS_COMMAND_REPOSITORY =
  "SUBSCRIPTIONS_COMMAND_REPOSITORY"

export interface ISubscriptionsCommandRepository {
  add(subscription: Subscription, transactionEm?: EntityManager): Promise<void>

  delete(
    subscription: Subscription,
    transactionEm?: EntityManager
  ): Promise<void>
}
