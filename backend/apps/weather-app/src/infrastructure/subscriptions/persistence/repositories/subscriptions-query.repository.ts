import { Injectable } from "@nestjs/common"
import { EntityManager } from "@mikro-orm/postgresql"
import { ISubscriptionsQueryRepository } from "../../../../domain/subscriptions/repositories/subscriptions-query.repository.interface"
import { Subscription } from "../../../../domain/subscriptions/entities/subscription.entity"
import { Frequency } from "../../../../domain/subscriptions/enums/frequency.enum"

@Injectable()
export class SubscriptionsQueryRepository
  implements ISubscriptionsQueryRepository
{
  constructor(private readonly em: EntityManager) {}

  async findByEmailAndCity(
    email: string,
    city: string,
    transactionEm?: EntityManager
  ) {
    const em = transactionEm || this.em
    return await em.findOne(Subscription, {
      ["_email" as "email"]: email,
      ["_city" as "city"]: city
    })
  }

  async findByConfirmationToken(
    confirmationToken: string,
    transactionEm?: EntityManager
  ) {
    const em = transactionEm || this.em
    return await em.findOne(Subscription, {
      ["_confirmationToken" as "confirmationToken"]: confirmationToken
    })
  }

  async findByUnsubscribeToken(
    unsubscribeToken: string,
    transactionEm?: EntityManager
  ) {
    const em = transactionEm || this.em
    return await em.findOne(Subscription, {
      ["_unsubscribeToken" as "unsubscribeToken"]: unsubscribeToken
    })
  }

  async findAllActiveByFrequency(
    frequency: Frequency,
    transactionEm?: EntityManager
  ) {
    const em = transactionEm || this.em
    return await em.find(Subscription, {
      ["_frequency" as "frequency"]: frequency,
      ["_isConfirmed" as "isConfirmed"]: true
    })
  }
}
