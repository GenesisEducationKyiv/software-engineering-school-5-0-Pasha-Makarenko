import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/sequelize"
import { Subscription } from "../../../../domain/subscriptions/entities/subscription.entity"
import { Subscription as SubscriptionModel } from "../models/subscription.model"
import { ISubscriptionsCommandRepository } from "../../../../domain/subscriptions/repositories/subscriptions-command.repository.interface"
import { SubscriptionCreationFailedException } from "../../../../domain/subscriptions/exceptions/subscription-creation-failed.exception"
import { SubscriptionUpdateFailedException } from "../../../../domain/subscriptions/exceptions/subscription-update-failed.exception"
import { SubscriptionDeletionFailedException } from "../../../../domain/subscriptions/exceptions/subscription-deletion-failed.exception"
import { SubscriptionCreation } from "../../../../domain/subscriptions/value-objects/subscription-creation.value-object"

@Injectable()
export class SubscriptionsCommandRepository
  implements ISubscriptionsCommandRepository
{
  constructor(
    @InjectModel(SubscriptionModel)
    private subscriptionsTable: typeof SubscriptionModel
  ) {}

  async create(attributes: SubscriptionCreation) {
    const sub = await this.subscriptionsTable.create(attributes)

    if (!sub) {
      throw new SubscriptionCreationFailedException()
    }

    return sub.to_entity()
  }

  async update(subscription: Subscription) {
    const [updateCount, [updatedSubscription]] =
      await this.subscriptionsTable.update(
        {
          email: subscription.email,
          city: subscription.city,
          frequency: subscription.frequency,
          confirmationToken: subscription.confirmationToken,
          unsubscribeToken: subscription.unsubscribeToken,
          isConfirmed: subscription.isConfirmed
        },
        {
          where: { id: subscription.id },
          returning: true
        }
      )

    if (updateCount === 0) {
      throw new SubscriptionUpdateFailedException()
    }

    return updatedSubscription.to_entity()
  }

  async delete(subscriptionId: string) {
    const deletedCount = await this.subscriptionsTable.destroy({
      where: { id: subscriptionId }
    })

    if (deletedCount === 0) {
      throw new SubscriptionDeletionFailedException()
    }

    return
  }
}
