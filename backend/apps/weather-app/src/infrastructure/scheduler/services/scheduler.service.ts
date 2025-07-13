import { Injectable } from "@nestjs/common"
import { CommandBus } from "@nestjs/cqrs"
import { Cron, CronExpression } from "@nestjs/schedule"
import { SendWeatherCommand } from "../../../application/scheduler/commands/impl/send-weather.command"
import { Frequency } from "../../../domain/subscriptions/enums/frequency.enum"

@Injectable()
export class SchedulerService {
  constructor(private commandBus: CommandBus) {}

  @Cron(CronExpression.EVERY_HOUR)
  async sendWeatherHourly() {
    await this.commandBus.execute(new SendWeatherCommand(Frequency.HOURLY))
  }

  @Cron(CronExpression.EVERY_DAY_AT_7AM)
  async sendWeatherDaily() {
    await this.commandBus.execute(new SendWeatherCommand(Frequency.DAILY))
  }
}
