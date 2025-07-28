import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { SendConfirmationNotificationCommand } from "../impl/send-confimation-notification.command"
import { catchError } from "rxjs"
import { NotificationSendingFailedException } from "../../exceptions/notification-sending-failed.exception"
import { Inject, Logger } from "@nestjs/common"
import {
  INotificationsClient,
  NOTIFICATIONS_CLIENT
} from "../../interfaces/notifications.client"

@CommandHandler(SendConfirmationNotificationCommand)
export class SendConfirmationNotificationHandler
  implements ICommandHandler<SendConfirmationNotificationCommand>
{
  private readonly logger = new Logger(SendConfirmationNotificationHandler.name)

  constructor(
    @Inject(NOTIFICATIONS_CLIENT)
    private client: INotificationsClient
  ) {}

  async execute(command: SendConfirmationNotificationCommand) {
    const { dto } = command

    this.logger.log({
      operation: "sendConfirmationNotification",
      params: dto,
      message: "Sending confirmation notification"
    })

    this.client.sendConfirmation(dto).pipe(
      catchError(error => {
        throw new NotificationSendingFailedException(
          "Failed to emit confirmation notification",
          error
        )
      })
    )
  }
}
