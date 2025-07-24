import {
  CommandBus,
  CommandHandler,
  ICommandHandler,
  QueryBus
} from "@nestjs/cqrs"
import { SendWeatherCommand } from "../impl/send-weather.command"
import { Inject, Logger } from "@nestjs/common"
import { SendWeatherScheduler } from "../../services/send-weather.scheduler"
import { GetActiveSubscriptionsQuery } from "../../../subscriptions/queries/impl/get-active-subscriptions.query"
import { GetWeatherQuery } from "../../../weather/queries/impl/get-weather.query"
import { GetCitiesQuery } from "../../../search/queries/impl/get-cities.query"
import {
  IUrlGeneratorService,
  URL_GENERATOR_SERVICE
} from "../../../common/interfaces/url-generator.interfaces"
import { NotFoundException } from "../../../../domain/common/exceptions/not-found.exception"
import { SendWeatherNotificationCommand } from "../../../notifications/commands/impl/send-weather-notification.command"
import { NotificationType } from "../../../notifications/enums/notification-type.enum"
import {
  IWeatherContextMapper,
  WEATHER_CONTEXT_MAPPER
} from "../../../notifications/interfaces/weather-context.interface"

@CommandHandler(SendWeatherCommand)
export class SendWeatherHandler implements ICommandHandler<SendWeatherCommand> {
  private logger = new Logger(SendWeatherScheduler.name)

  constructor(
    @Inject(URL_GENERATOR_SERVICE)
    private urlGeneratorService: IUrlGeneratorService,
    private queryBus: QueryBus,
    private commandBus: CommandBus,
    @Inject(WEATHER_CONTEXT_MAPPER)
    private mapper: IWeatherContextMapper
  ) {}

  async execute(command: SendWeatherCommand) {
    const { frequency } = command

    const subscriptions = await this.queryBus.execute(
      new GetActiveSubscriptionsQuery(frequency)
    )

    for (const sub of subscriptions) {
      try {
        const cities = await this.queryBus.execute(
          new GetCitiesQuery({ city: sub.city })
        )

        if (!cities || cities.length === 0) {
          throw new NotFoundException(
            `No cities found for subscription city: ${sub.city}`
          )
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
          throw new NotFoundException(
            `Weather data not found for city: ${cities[0].name}`
          )
        }

        const unsubscribeUrl = this.urlGeneratorService.unsubscribeUrl(
          sub.unsubscribeToken
        )

        await this.commandBus.execute(
          new SendWeatherNotificationCommand({
            recipients: [sub.email],
            subject: "Weather",
            type: NotificationType.EMAIL,
            context: {
              unsubscribeUrl,
              weather: this.mapper.map(weather)
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
