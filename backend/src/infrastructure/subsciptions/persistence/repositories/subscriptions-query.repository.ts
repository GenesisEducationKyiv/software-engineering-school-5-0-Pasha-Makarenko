import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/sequelize"
import { ISubscriptionsQueryRepository } from "../../../../domain/subscriptions/repositories/subscriptions-query.repository.interface"
import { Subscription } from "../models/subscription.model"
import { Frequency } from "../../../../domain/subscriptions/enums/frequency.enum"

@Injectable()
export class SubscriptionsQueryRepository
  implements ISubscriptionsQueryRepository
{
  constructor(
    @InjectModel(Subscription)
    private subscriptionsTable: typeof Subscription
  ) {}

  async findByEmailAndCity(email: string, city: string) {
    const subscription = await this.subscriptionsTable.findOne({
      where: { email, city }
    })

    return subscription?.to_entity() || null
  }

  async findByConfirmationToken(confirmationToken: string) {
    const subscription = await this.subscriptionsTable.findOne({
      where: { confirmationToken }
    })

    return subscription?.to_entity() || null
  }

  async findByUnsubscribeToken(unsubscribeToken: string) {
    const subscription = await this.subscriptionsTable.findOne({
      where: { unsubscribeToken }
    })

    return subscription?.to_entity() || null
  }

  async findAllActiveByFrequency(frequency: Frequency) {
    const subscriptions = await this.subscriptionsTable.findAll({
      where: { frequency, isConfirmed: true }
    })

    return subscriptions.map(subscription => subscription.to_entity())
  }
}
