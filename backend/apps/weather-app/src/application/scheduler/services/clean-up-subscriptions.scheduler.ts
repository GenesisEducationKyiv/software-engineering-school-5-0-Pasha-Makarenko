import { Injectable, Logger } from "@nestjs/common"
import { CommandBus } from "@nestjs/cqrs"
import { Cron, CronExpression } from "@nestjs/schedule"
import { CleanUpSubscriptionsCommand } from "../commands/impl/clean-up-subscriptions.command"

@Injectable()
export class CleanUpSubscriptionsScheduler {
  private readonly logger = new Logger(CleanUpSubscriptionsScheduler.name)

  constructor(private commandBus: CommandBus) {}

  @Cron(CronExpression.EVERY_HOUR)
  async cleanUpSubscriptions() {
    this.logger.log({
      operation: "cleanUpSubscriptions",
      message: "Starting cleanup of inactive subscriptions"
    })
    await this.commandBus.execute(
      new CleanUpSubscriptionsCommand(24 * 60 * 60 * 1000)
    )
    this.logger.log({
      operation: "cleanUpSubscriptions",
      message: "Cleanup of inactive subscriptions completed successfully"
    })
  }
}
