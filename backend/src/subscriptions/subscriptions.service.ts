import { Injectable } from "@nestjs/common"
import { CreateSubscriptionDto } from "./dto/create-subscription.dto"
import { Subscription } from "./subscription.model"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { CreateSubscriptionCommand } from "./commands/create-subscription.command"
import { ConfirmSubscriptionCommand } from "./commands/confirm-subscription.command"
import { UnsubscribeCommand } from "./commands/unsubscribe.command"
import { GetActiveSubscriptionsQuery } from "./queries/get-active-subscriptions.query"

@Injectable()
export class SubscriptionsService {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus
  ) {}

  async createSubscription(dto: CreateSubscriptionDto) {
    return await this.commandBus.execute(new CreateSubscriptionCommand(dto))
  }

  async confirm(confirmationToken: string) {
    return await this.commandBus.execute(
      new ConfirmSubscriptionCommand(confirmationToken)
    )
  }

  async unsubscribe(unsubscribeToken: string) {
    return await this.commandBus.execute(
      new UnsubscribeCommand(unsubscribeToken)
    )
  }

  async getActive(where: Partial<Subscription>) {
    return await this.queryBus.execute(new GetActiveSubscriptionsQuery(where))
  }
}
