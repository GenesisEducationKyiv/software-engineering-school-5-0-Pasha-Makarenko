import { Inject } from "@nestjs/common"
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import * as CircuitBreaker from "opossum"
import { SendConfirmationNotificationCommand } from "../impl/send-confirmation-notification.command"
import {
  NOTIFICATION_STRATEGY,
  NotificationStrategyType,
  SendNotificationStrategy
} from "../../interfaces/send-notification.strategy"
import { ConfirmContextDto } from "../../dto/confirmation-notification.dto"
import { NotFoundNotificationStrategyException } from "../../exceptions/not-found-notification-strategy.exception"
import { NotificationTemplate } from "../../../../domain/notifications/enums/notification-template.enum"

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

    const circuit = new CircuitBreaker(
      () =>
        strategy.send(
          dto.recipients,
          dto.subject,
          dto.context,
          NotificationTemplate.CONFIRMATION
        ),
      {
        timeout: 5000,
        errorThresholdPercentage: 50,
        resetTimeout: 30000
      }
    )

    await circuit.fire()
  }
}
