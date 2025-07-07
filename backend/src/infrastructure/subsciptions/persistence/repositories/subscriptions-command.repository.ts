import { Injectable } from "@nestjs/common"
import { EntityManager } from "@mikro-orm/postgresql"
import { Subscription } from "../../../../domain/subscriptions/entities/subscription.entity"
import { ISubscriptionsCommandRepository } from "../../../../domain/subscriptions/repositories/subscriptions-command.repository.interface"

@Injectable()
export class SubscriptionsCommandRepository
  implements ISubscriptionsCommandRepository
{
  constructor(private readonly em: EntityManager) {}

  async add(subscription: Subscription, transactionEm?: EntityManager) {
    const em = transactionEm || this.em
    em.persist(subscription)
  }

  async delete(subscription: Subscription, transactionEm?: EntityManager) {
    const em = transactionEm || this.em
    em.remove(subscription)
  }
}
