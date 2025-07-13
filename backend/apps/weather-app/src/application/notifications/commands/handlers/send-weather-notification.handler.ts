import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { catchError } from "rxjs"
import { NotificationSendingFailedException } from "../../exceptions/notification-sending-failed.exception"
import { SendWeatherNotificationCommand } from "../impl/send-weather-notification.command"
import {
  IWeatherContextMapper,
  WEATHER_CONTEXT_MAPPER
} from "../../interfaces/weather-context.interface"
import { Inject } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import {
  INotificationsClient,
  NOTIFICATIONS_CLIENT
} from "../../interfaces/notifications.client"

@CommandHandler(SendWeatherNotificationCommand)
export class SendWeatherNotificationHandler
  implements ICommandHandler<SendWeatherNotificationCommand>
{
  constructor(
    @Inject(NOTIFICATIONS_CLIENT)
    private client: INotificationsClient,
    private configService: ConfigService,
    @Inject(WEATHER_CONTEXT_MAPPER)
    private mapper: IWeatherContextMapper
  ) {}

  async execute(command: SendWeatherNotificationCommand) {
    const { dto } = command

    this.client
      .emit("notifications.sendWeather", {
        ...dto,
        context: {
          ...dto.context,
          weather: this.mapper.map(dto.context.weather)
        }
      })
      .pipe(
        catchError(error => {
          throw new NotificationSendingFailedException(
            "Failed to emit weather notification",
            error
          )
        })
      )
  }
}
