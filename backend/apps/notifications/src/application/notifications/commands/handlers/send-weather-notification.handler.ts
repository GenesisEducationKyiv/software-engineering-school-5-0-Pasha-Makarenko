import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { SendWeatherNotificationCommand } from "../impl/send-weather-notification.command"
import {
  NOTIFICATION_STRATEGY,
  NotificationStrategyType,
  SendNotificationStrategy
} from "../../interfaces/send-notification.strategy"
import { WeatherContextDto } from "../../dto/weather-notification.dto"
import { NotificationTemplate } from "../../../../domain/notifications/enums/notification-template.enum"
import { NotFoundNotificationStrategyException } from "../../exceptions/not-found-notification-strategy.exception"
import { Inject } from "@nestjs/common"

@CommandHandler(SendWeatherNotificationCommand)
export class SendWeatherNotificationHandler
  implements ICommandHandler<SendWeatherNotificationCommand>
{
  constructor(
    @Inject(NOTIFICATION_STRATEGY)
    private readonly strategies: Record<
      NotificationStrategyType,
      SendNotificationStrategy<WeatherContextDto>
    >
  ) {}

  async execute(command: SendWeatherNotificationCommand) {
    const { dto } = command
    const strategy = this.strategies[dto.type]

    if (!strategy) {
      throw new NotFoundNotificationStrategyException(dto.type)
    }

    await strategy.send(
      dto.recipients,
      dto.subject,
      dto.context,
      NotificationTemplate.WEATHER
    )
  }
}
