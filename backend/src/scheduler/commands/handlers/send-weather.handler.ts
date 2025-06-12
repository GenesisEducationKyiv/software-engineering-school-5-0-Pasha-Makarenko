import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { SendWeatherCommand } from "../send-weather.command"
import { MailService } from "../../../mail/mail.service"
import { SubscriptionsService } from "../../../subscriptions/subscriptions.service"
import { WeatherService } from "../../../weather/weather.service"
import { BadRequestException, Logger } from "@nestjs/common"
import { SchedulerService } from "../../scheduler.service"
import { UrlGeneratorService } from "../../../url-generator/url-generator.service"

@CommandHandler(SendWeatherCommand)
export class SendWeatherHandler implements ICommandHandler<SendWeatherCommand> {
  private logger = new Logger(SchedulerService.name)

  constructor(
    private urlGeneratorService: UrlGeneratorService,
    private subscriptionsService: SubscriptionsService,
    private mailService: MailService,
    private weatherService: WeatherService
  ) {}

  async execute(command: SendWeatherCommand) {
    const { frequency } = command

    const subscriptions = await this.subscriptionsService.getActive({
      frequency
    })

    for (const sub of subscriptions) {
      try {
        const weather = await this.weatherService.weather({
          city: sub.city,
          days: "1"
        })

        if (!weather) {
          throw new BadRequestException("Unable to get data")
        }

        const unsubscribeUrl = await this.urlGeneratorService.unsubscribeUrl(
          sub.unsubscribeToken
        )

        await this.mailService.sendMail({
          emails: [sub.email],
          subject: "Weather",
          template: "weather",
          context: {
            unsubscribeUrl,
            weather
          }
        })
      } catch (error) {
        this.logger.error(
          `Failed to process subscription for ${sub.email}:`,
          error.message
        )
      }
    }
  }
}
