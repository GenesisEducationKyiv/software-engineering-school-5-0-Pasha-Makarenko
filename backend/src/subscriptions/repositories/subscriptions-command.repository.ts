import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/sequelize"
import { Subscription } from "../models/subscription.model"
import { ISubscriptionsCommandRepository } from "../interfaces/subscriptions-command.repository.interface"

export const SUBSCRIPTIONS_COMMAND_REPOSITORY =
  "SUBSCRIPTIONS_COMMAND_REPOSITORY"

@Injectable()
export class SubscriptionsCommandRepository
  implements ISubscriptionsCommandRepository
{
  constructor(
    @InjectModel(Subscription)
    private subscriptionsTable: typeof Subscription
  ) {}

  async create(subscription) {
    return await this.subscriptionsTable.create(subscription)
  }

  async confirmByToken(confirmationToken: string) {
    const subscription = await this.subscriptionsTable.findOne({
      where: { confirmationToken }
    })

    if (!subscription) {
      return null
    }

    subscription.isConfirmed = true

    return await subscription.save()
  }

  async unsubscribeByToken(unsubscribeToken: string) {
    const subscription = await this.subscriptionsTable.findOne({
      where: { unsubscribeToken }
    })

    if (!subscription) {
      return
    }

    return await subscription.destroy()
  }
}
