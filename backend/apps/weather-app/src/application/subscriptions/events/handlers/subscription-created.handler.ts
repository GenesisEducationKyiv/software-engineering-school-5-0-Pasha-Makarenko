import { CommandBus, EventsHandler, IEventHandler } from "@nestjs/cqrs"
import { SubscriptionCreatedEvent } from "../impl/subscription-created.event"
import { Inject } from "@nestjs/common"
import {
  IUrlGeneratorService,
  URL_GENERATOR_SERVICE
} from "../../../common/interfaces/url-generator.interfaces"
import { SendConfirmationNotificationCommand } from "../../../notifications/commands/impl/send-confimation-notification.command"
import { NotificationType } from "../../../notifications/enums/notification-type.enum"

@EventsHandler(SubscriptionCreatedEvent)
export class SubscriptionCreatedHandler
  implements IEventHandler<SubscriptionCreatedEvent>
{
  constructor(
    @Inject(URL_GENERATOR_SERVICE)
    private urlGeneratorService: IUrlGeneratorService,
    private commandBus: CommandBus
  ) {}

  async handle(event: SubscriptionCreatedEvent) {
    const { subscription } = event

    const confirmUrl = this.urlGeneratorService.confirmUrl(
      subscription.confirmationToken
    )

    await this.commandBus.execute(
      new SendConfirmationNotificationCommand({
        recipients: [subscription.email],
        subject: "Confirmation",
        type: NotificationType.EMAIL,
        context: { confirmUrl }
      })
    )
  }
}
