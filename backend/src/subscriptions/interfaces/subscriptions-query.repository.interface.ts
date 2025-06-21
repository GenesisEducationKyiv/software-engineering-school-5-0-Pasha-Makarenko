import { FindSubscriptionDto } from "../dto/find-subscription.dto"
import { Frequency, Subscription } from "../models/subscription.model"

export interface ISubscriptionsQueryRepository {
  findByEmailAndCity(dto: FindSubscriptionDto): Promise<Subscription | null>

  findByConfirmationToken(
    confirmationToken: string
  ): Promise<Subscription | null>

  findByUnsubscribeToken(unsubscribeToken: string): Promise<Subscription | null>

  findAllActiveByFrequency(frequency: Frequency): Promise<Subscription[]>
}
