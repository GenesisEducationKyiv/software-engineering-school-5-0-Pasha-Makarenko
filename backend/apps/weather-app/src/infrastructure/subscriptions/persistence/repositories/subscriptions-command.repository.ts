import { Injectable, Logger } from "@nestjs/common"
import { EntityManager } from "@mikro-orm/postgresql"
import { Subscription } from "../../../../domain/subscriptions/entities/subscription.entity"
import { ISubscriptionsCommandRepository } from "../../../../domain/subscriptions/repositories/subscriptions-command.repository.interface"

@Injectable()
export class SubscriptionsCommandRepository
  implements ISubscriptionsCommandRepository
{
  private readonly logger = new Logger(SubscriptionsCommandRepository.name)

  constructor(private readonly em: EntityManager) {}

  async add(subscription: Subscription, transactionEm?: EntityManager) {
    this.logger.log({
      operation: "addSubscription",
      params: {
        subscription_id: subscription.id,
        email: subscription.email,
        city: subscription.city
      },
      message: "Adding new subscription to database"
    })

    const em = transactionEm || this.em
    em.persist(subscription)

    this.logger.log({
      operation: "addSubscription",
      params: { subscription_id: subscription.id },
      message: "Subscription added to database successfully"
    })
  }
}
