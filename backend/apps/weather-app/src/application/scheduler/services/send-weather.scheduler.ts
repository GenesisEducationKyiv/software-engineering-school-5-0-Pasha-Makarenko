import { Injectable, Logger } from "@nestjs/common"
import { CommandBus } from "@nestjs/cqrs"
import { Cron, CronExpression } from "@nestjs/schedule"
import { SendWeatherCommand } from "../commands/impl/send-weather.command"
import { Frequency } from "../../../domain/subscriptions/enums/frequency.enum"

@Injectable()
export class SendWeatherScheduler {
  private readonly logger = new Logger(SendWeatherScheduler.name)

  constructor(private commandBus: CommandBus) {}

  @Cron(CronExpression.EVERY_HOUR)
  async sendWeatherHourly() {
    this.logger.log({
      operation: "sendWeatherHourly",
      message: "Starting hourly weather notification job"
    })
    await this.commandBus.execute(new SendWeatherCommand(Frequency.HOURLY))
    this.logger.log({
      operation: "sendWeatherHourly",
      message: "Hourly weather notification job completed successfully"
    })
  }

  @Cron(CronExpression.EVERY_DAY_AT_7AM)
  async sendWeatherDaily() {
    this.logger.log({
      operation: "sendWeatherDaily",
      message: "Starting daily weather notification job"
    })
    await this.commandBus.execute(new SendWeatherCommand(Frequency.DAILY))
    this.logger.log({
      operation: "sendWeatherDaily",
      message: "Daily weather notification job completed successfully"
    })
  }
}
