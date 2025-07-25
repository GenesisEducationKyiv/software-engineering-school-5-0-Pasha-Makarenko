import { Inject } from "@nestjs/common"
import {
  ISubscriptionsQueryRepository,
  SUBSCRIPTIONS_QUERY_REPOSITORY
} from "../repositories/subscriptions-query.repository.interface"
import { ConflictException } from "../../common/exceptions/conflict.exception"
import { Subscription } from "../entities/subscription.entity"
import { Frequency } from "../enums/frequency.enum"

export class SubscriptionFactory {
  constructor(
    @Inject(SUBSCRIPTIONS_QUERY_REPOSITORY)
    private subscriptionsQueryRepository: ISubscriptionsQueryRepository
  ) {}

  async create(
    email: string,
    city: string,
    frequency: Frequency,
    confirmationToken: string,
    unsubscribeToken: string
  ) {
    const existingSubscription =
      await this.subscriptionsQueryRepository.findByEmailAndCity(email, city)

    if (existingSubscription) {
      throw new ConflictException(
        `Subscription with email ${email} and city ${city} already exists`
      )
    }

    return Subscription.create(
      null,
      email,
      city,
      frequency,
      confirmationToken,
      unsubscribeToken
    )
  }
}
