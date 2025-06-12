import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { GetActiveSubscriptionsQuery } from "../get-active-subscriptions.query"
import { InjectModel } from "@nestjs/sequelize"
import { Subscription } from "../../subscription.model"

@QueryHandler(GetActiveSubscriptionsQuery)
export class GetActiveSubscriptionsHandler
  implements IQueryHandler<GetActiveSubscriptionsQuery>
{
  constructor(
    @InjectModel(Subscription)
    private subscriptionsRepository: typeof Subscription
  ) {}

  async execute(query: GetActiveSubscriptionsQuery) {
    const { where } = query

    return this.subscriptionsRepository.findAll({
      where: {
        ...where,
        isConfirmed: true
      }
    })
  }
}
