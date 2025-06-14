import {
  CommandBus,
  CommandHandler,
  ICommandHandler,
  QueryBus
} from "@nestjs/cqrs"
import { SendWeatherCommand } from "../impl/send-weather.command"
import { BadRequestException, Logger } from "@nestjs/common"
import { SchedulerService } from "../../services/scheduler.service"
import { UrlGeneratorService } from "../../../url-generator/services/url-generator.service"
import { GetActiveSubscriptionsQuery } from "../../../subscriptions/queries/impl/get-active-subscriptions.query"
import { GetWeatherQuery } from "../../../weather/queries/impl/get-weather.query"
import { SendMailCommand } from "../../../mail/commands/impl/send-mail.command"

@CommandHandler(SendWeatherCommand)
export class SendWeatherHandler implements ICommandHandler<SendWeatherCommand> {
  private logger = new Logger(SchedulerService.name)

  constructor(
    private urlGeneratorService: UrlGeneratorService,
    private queryBus: QueryBus,
    private commandBus: CommandBus
  ) {}

  async execute(command: SendWeatherCommand) {
    const { frequency } = command

    const subscriptions = await this.queryBus.execute(
      new GetActiveSubscriptionsQuery({
        frequency
      })
    )

    for (const sub of subscriptions) {
      try {
        const weather = await this.queryBus.execute(
          new GetWeatherQuery({
            city: sub.city,
            days: "1"
          })
        )

        if (!weather) {
          throw new BadRequestException("Unable to get data")
        }

        const { url: unsubscribeUrl } = this.urlGeneratorService.unsubscribeUrl(
          sub.unsubscribeToken
        )

        await this.commandBus.execute(
          new SendMailCommand({
            emails: [sub.email],
            subject: "Weather",
            template: "weather",
            context: {
              unsubscribeUrl,
              weather
            }
          })
        )
      } catch (error) {
        this.logger.error(
          `Failed to process subscription for ${sub.email}:`,
          error.message
        )
      }
    }
  }
}
