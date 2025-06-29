import {
  CommandBus,
  CommandHandler,
  ICommandHandler,
  QueryBus
} from "@nestjs/cqrs"
import { SendWeatherCommand } from "../impl/send-weather.command"
import { Inject, Logger } from "@nestjs/common"
import { SchedulerService } from "../../services/scheduler.service"
import { URL_GENERATOR_SERVICE } from "../../../url-generator/services/url-generator.service"
import { GetActiveSubscriptionsQuery } from "../../../subscriptions/queries/impl/get-active-subscriptions.query"
import { GetWeatherQuery } from "../../../weather/queries/impl/get-weather.query"
import { SendMailCommand } from "../../../mail/commands/impl/send-mail.command"
import { WeatherDataUnavailableException } from "../../../weather/exceptions/weather-data-unavailable.exception"
import { GetCitiesQuery } from "../../../search/queries/impl/get-cities.query"
import { CityNotFoundException } from "../../../search/exceptions/city-not-found.exception"
import { IUrlGeneratorService } from "../../../url-generator/interfaces/url-generator.interfaces"

@CommandHandler(SendWeatherCommand)
export class SendWeatherHandler implements ICommandHandler<SendWeatherCommand> {
  private logger = new Logger(SchedulerService.name)

  constructor(
    @Inject(URL_GENERATOR_SERVICE)
    private urlGeneratorService: IUrlGeneratorService,
    private queryBus: QueryBus,
    private commandBus: CommandBus
  ) {}

  async execute(command: SendWeatherCommand) {
    const { frequency } = command

    const subscriptions = await this.queryBus.execute(
      new GetActiveSubscriptionsQuery(frequency)
    )

    for (const sub of subscriptions) {
      try {
        const cities = await this.queryBus.execute(new GetCitiesQuery(sub.city))

        if (!cities || cities.length === 0) {
          throw new CityNotFoundException(sub.city)
        }

        const weather = await this.queryBus.execute(
          new GetWeatherQuery({
            city: cities[0].name,
            lat: cities[0].lat,
            lon: cities[0].lon,
            days: 1
          })
        )

        if (!weather) {
          throw new WeatherDataUnavailableException()
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
