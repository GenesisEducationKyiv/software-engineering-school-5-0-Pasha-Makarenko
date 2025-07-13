import { Command } from "@nestjs/cqrs"
import { ConfirmationNotificationDto } from "../../dto/confirmation-notification.dto"

export class SendConfirmationNotificationCommand extends Command<void> {
  constructor(public readonly dto: ConfirmationNotificationDto) {
    super()
  }
}
