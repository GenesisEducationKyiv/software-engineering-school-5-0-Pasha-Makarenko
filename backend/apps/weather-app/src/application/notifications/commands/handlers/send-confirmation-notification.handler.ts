import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { SendConfirmationNotificationCommand } from "../impl/send-confimation-notification.command"
import { catchError } from "rxjs"
import { NotificationSendingFailedException } from "../../exceptions/notification-sending-failed.exception"
import { Inject } from "@nestjs/common"
import {
  INotificationsClient,
  NOTIFICATIONS_CLIENT
} from "../../interfaces/notifications.client"

@CommandHandler(SendConfirmationNotificationCommand)
export class SendConfirmationNotificationHandler
  implements ICommandHandler<SendConfirmationNotificationCommand>
{
  constructor(
    @Inject(NOTIFICATIONS_CLIENT)
    private client: INotificationsClient
  ) {}

  async execute(command: SendConfirmationNotificationCommand) {
    const { dto } = command

    this.client.emit("notifications.sendConfirmation", dto).pipe(
      catchError(error => {
        throw new NotificationSendingFailedException(
          "Failed to emit confirmation notification",
          error
        )
      })
    )
  }
}
