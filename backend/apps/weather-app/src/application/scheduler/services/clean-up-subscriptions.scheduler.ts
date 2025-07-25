import { Injectable } from "@nestjs/common"
import { CommandBus } from "@nestjs/cqrs"
import { Cron, CronExpression } from "@nestjs/schedule"
import { CleanUpSubscriptionsCommand } from "../commands/impl/clean-up-subscriptions.command"

@Injectable()
export class CleanUpSubscriptionsScheduler {
  constructor(private commandBus: CommandBus) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanUpSubscriptions() {
    await this.commandBus.execute(
      new CleanUpSubscriptionsCommand(24 * 60 * 60 * 1000)
    )
  }
}
