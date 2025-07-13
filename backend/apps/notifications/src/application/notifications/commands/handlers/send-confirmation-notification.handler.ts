import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { SendConfirmationNotificationCommand } from "../impl/send-confirmation-notification.command"
import {
  NOTIFICATION_STRATEGY,
  NotificationStrategyType,
  SendNotificationStrategy
} from "../../interfaces/send-notification.strategy"
import { ConfirmContextDto } from "../../dto/confirmation-notification.dto"
import { NotFoundNotificationStrategyException } from "../../exceptions/not-found-notification-strategy.exception"
import { NotificationTemplate } from "../../../../domain/notifications/enums/notification-template.enum"
import { Inject } from "@nestjs/common"

@CommandHandler(SendConfirmationNotificationCommand)
export class SendConfirmationNotificationHandler
  implements ICommandHandler<SendConfirmationNotificationCommand>
{
  constructor(
    @Inject(NOTIFICATION_STRATEGY)
    private readonly strategies: Record<
      NotificationStrategyType,
      SendNotificationStrategy<ConfirmContextDto>
    >
  ) {}

  async execute(command: SendConfirmationNotificationCommand) {
    const { dto } = command
    const strategy = this.strategies[dto.type]

    if (!strategy) {
      throw new NotFoundNotificationStrategyException(dto.type)
    }

    await strategy.send(
      dto.recipients,
      dto.subject,
      dto.context,
      NotificationTemplate.CONFIRMATION
    )
  }
}
