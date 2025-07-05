import { Subscription } from "../entities/subscription.entity"
import { Frequency } from "../enums/frequency.enum"

export const SUBSCRIPTIONS_QUERY_REPOSITORY = "SUBSCRIPTIONS_QUERY_REPOSITORY"

export interface ISubscriptionsQueryRepository {
  findByEmailAndCity(email: string, city: string): Promise<Subscription | null>

  findByConfirmationToken(
    confirmationToken: string
  ): Promise<Subscription | null>

  findByUnsubscribeToken(unsubscribeToken: string): Promise<Subscription | null>

  findAllActiveByFrequency(frequency: Frequency): Promise<Subscription[]>
}
