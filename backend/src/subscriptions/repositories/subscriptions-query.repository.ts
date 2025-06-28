import { FindSubscriptionDto } from "../dto/find-subscription.dto"
import { Frequency, Subscription } from "../models/subscription.model"
import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/sequelize"
import { ISubscriptionsQueryRepository } from "../interfaces/subscriptions-query.repository.interface"

export const SUBSCRIPTIONS_QUERY_REPOSITORY = "SUBSCRIPTIONS_QUERY_REPOSITORY"

@Injectable()
export class SubscriptionsQueryRepository
  implements ISubscriptionsQueryRepository
{
  constructor(
    @InjectModel(Subscription)
    private subscriptionsTable: typeof Subscription
  ) {}

  async findByEmailAndCity(dto: FindSubscriptionDto) {
    return await this.subscriptionsTable.findOne({
      where: {
        email: dto.email,
        city: dto.city
      }
    })
  }

  async findByConfirmationToken(confirmationToken: string) {
    return await this.subscriptionsTable.findOne({
      where: { confirmationToken }
    })
  }

  async findByUnsubscribeToken(unsubscribeToken: string) {
    return await this.subscriptionsTable.findOne({
      where: { unsubscribeToken }
    })
  }

  async findAllActiveByFrequency(frequency: Frequency) {
    return await this.subscriptionsTable.findAll({
      where: {
        isConfirmed: true,
        frequency
      }
    })
  }
}
