import { Injectable, Logger } from "@nestjs/common"
import { EntityManager } from "@mikro-orm/postgresql"
import {
  ISubscriptionsQueryRepository,
  SUBSCRIPTIONS_QUERY_REPOSITORY
} from "../../../../domain/subscriptions/repositories/subscriptions-query.repository.interface"
import { Subscription } from "../../../../domain/subscriptions/entities/subscription.entity"
import { Frequency } from "../../../../domain/subscriptions/enums/frequency.enum"

@Injectable()
export class SubscriptionsQueryRepository
  implements ISubscriptionsQueryRepository
{
  private readonly logger = new Logger(SUBSCRIPTIONS_QUERY_REPOSITORY)

  constructor(private readonly em: EntityManager) {}

  async findByEmailAndCity(
    email: string,
    city: string,
    transactionEm?: EntityManager
  ) {
    this.logger.log({
      operation: "findByEmailAndCity",
      params: { email, city },
      message: "Searching for subscription by email and city"
    })

    const em = transactionEm || this.em
    const subscription = await em.findOne(Subscription, {
      ["_email" as "email"]: email,
      ["_city" as "city"]: city,
      ["_isUnsubscribed" as "isUnsubscribed"]: false
    })

    this.logger.log({
      operation: "findByEmailAndCity",
      params: { email, city },
      result: {
        subscription_id: subscription?.id
      },
      message: "Found subscription by email and city"
    })

    return subscription
  }

  async findByConfirmationToken(
    confirmationToken: string,
    transactionEm?: EntityManager
  ) {
    this.logger.log({
      operation: "findByConfirmationToken",
      params: { confirmationToken },
      message: "Searching for subscription by confirmation token"
    })

    const em = transactionEm || this.em
    const subscription = await em.findOne(Subscription, {
      ["_confirmationToken" as "confirmationToken"]: confirmationToken,
      ["_isUnsubscribed" as "isUnsubscribed"]: false
    })

    this.logger.log({
      operation: "findByConfirmationToken",
      params: { confirmationToken },
      result: {
        subscription_id: subscription?.id
      },
      message: "Found subscription by confirmation token"
    })

    return subscription
  }

  async findByUnsubscribeToken(
    unsubscribeToken: string,
    transactionEm?: EntityManager
  ) {
    this.logger.log({
      operation: "findByUnsubscribeToken",
      params: { unsubscribeToken },
      message: "Searching for subscription by unsubscribe token"
    })

    const em = transactionEm || this.em
    const subscription = await em.findOne(Subscription, {
      ["_unsubscribeToken" as "unsubscribeToken"]: unsubscribeToken,
      ["_isUnsubscribed" as "isUnsubscribed"]: false
    })

    this.logger.log({
      operation: "findByUnsubscribeToken",
      params: { unsubscribeToken },
      result: {
        subscription_id: subscription?.id
      },
      message: "Found subscription by unsubscribe token"
    })

    return subscription
  }

  async findAllActiveByFrequency(
    frequency: Frequency,
    transactionEm?: EntityManager
  ) {
    this.logger.log({
      operation: "findAllActiveByFrequency",
      params: { frequency },
      message: "Searching for all active subscriptions by frequency"
    })

    const em = transactionEm || this.em
    const subscriptions = await em.find(Subscription, {
      ["_frequency" as "frequency"]: frequency,
      ["_isConfirmed" as "isConfirmed"]: true,
      ["_isUnsubscribed" as "isUnsubscribed"]: false
    })

    this.logger.log({
      operation: "findAllActiveByFrequency",
      params: { frequency },
      result: { length: subscriptions.length },
      message: "Found all active subscriptions by frequency"
    })

    return subscriptions
  }

  async findAllInactiveByTime(time: number, transactionEm?: EntityManager) {
    this.logger.log({
      operation: "findAllInactiveByTime",
      params: { time },
      message: "Searching for all inactive subscriptions by time"
    })

    const em = transactionEm || this.em
    const subscriptions = await em.find(Subscription, {
      ["_isConfirmed" as "isConfirmed"]: false,
      ["_isUnsubscribed" as "isUnsubscribed"]: false,
      ["_createdAt" as "createdAt"]: {
        $lt: new Date(Date.now() - time)
      }
    })

    this.logger.log({
      operation: "findAllInactiveByTime",
      params: { time },
      result: { length: subscriptions.length },
      message: "Found all inactive subscriptions by time"
    })

    return subscriptions
  }
}
