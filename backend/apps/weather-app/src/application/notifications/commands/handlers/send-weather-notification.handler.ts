import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { catchError } from "rxjs"
import { NotificationSendingFailedException } from "../../exceptions/notification-sending-failed.exception"
import { SendWeatherNotificationCommand } from "../impl/send-weather-notification.command"
import { Inject, Logger } from "@nestjs/common"
import {
  INotificationsClient,
  NOTIFICATIONS_CLIENT
} from "../../interfaces/notifications.client"

@CommandHandler(SendWeatherNotificationCommand)
export class SendWeatherNotificationHandler
  implements ICommandHandler<SendWeatherNotificationCommand>
{
  private readonly logger = new Logger(SendWeatherNotificationHandler.name)

  constructor(
    @Inject(NOTIFICATIONS_CLIENT)
    private client: INotificationsClient
  ) {}

  async execute(command: SendWeatherNotificationCommand) {
    const { dto } = command

    this.logger.log({
      operation: "sendWeatherNotification",
      params: dto,
      message: "Sending weather notification"
    })

    this.client.sendWeather(dto).pipe(
      catchError(error => {
        throw new NotificationSendingFailedException(
          "Failed to emit weather notification",
          error
        )
      })
    )
  }
}
