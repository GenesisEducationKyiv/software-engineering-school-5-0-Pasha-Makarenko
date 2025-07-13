import { Subscription } from "../entities/subscription.entity"
import { Frequency } from "../enums/frequency.enum"
import { EntityManager } from "@mikro-orm/postgresql"

export const SUBSCRIPTIONS_QUERY_REPOSITORY = "SUBSCRIPTIONS_QUERY_REPOSITORY"

export interface ISubscriptionsQueryRepository {
  findByEmailAndCity(
    email: string,
    city: string,
    transactionEm?: EntityManager
  ): Promise<Subscription | null>

  findByConfirmationToken(
    confirmationToken: string,
    transactionEm?: EntityManager
  ): Promise<Subscription | null>

  findByUnsubscribeToken(
    unsubscribeToken: string,
    transactionEm?: EntityManager
  ): Promise<Subscription | null>

  findAllActiveByFrequency(
    frequency: Frequency,
    transactionEm?: EntityManager
  ): Promise<Subscription[]>
}
