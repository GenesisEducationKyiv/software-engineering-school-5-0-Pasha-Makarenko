import { Subscription } from "../entities/subscription.entity"
import { Frequency } from "../enums/frequency.enum"

export const SUBSCRIPTIONS_QUERY_REPOSITORY = "SUBSCRIPTIONS_QUERY_REPOSITORY"

export interface ISubscriptionsQueryRepository {
  findByEmailAndCity(
    email: string,
    city: string,
    transactionEm?: unknown
  ): Promise<Subscription | null>

  findByConfirmationToken(
    confirmationToken: string,
    transactionEm?: unknown
  ): Promise<Subscription | null>

  findByUnsubscribeToken(
    unsubscribeToken: string,
    transactionEm?: unknown
  ): Promise<Subscription | null>

  findAllActiveByFrequency(
    frequency: Frequency,
    transactionEm?: unknown
  ): Promise<Subscription[]>

  findAllInactiveByTime(
    time: number,
    transactionEm?: unknown
  ): Promise<Subscription[]>
}
