import { CommandBus, EventsHandler, IEventHandler } from "@nestjs/cqrs"
import { SubscriptionCreatedEvent } from "../impl/subscription-created.event"
import { UrlGeneratorService } from "../../../url-generator/services/url-generator.service"
import { SendMailCommand } from "../../../mail/commands/impl/send-mail.command"
import { SendConfirmationMailException } from "../../exceptions/send-confirmation-mail.exception"

@EventsHandler(SubscriptionCreatedEvent)
export class SubscriptionCreatedHandler
  implements IEventHandler<SubscriptionCreatedEvent>
{
  constructor(
    private urlGeneratorService: UrlGeneratorService,
    private commandBus: CommandBus
  ) {}

  async handle(event: SubscriptionCreatedEvent) {
    const { subscription } = event

    try {
      const { url: confirmUrl } = this.urlGeneratorService.confirmUrl(
        subscription.confirmationToken
      )

      await this.commandBus.execute(
        new SendMailCommand({
          emails: [subscription.email],
          subject: "Confirmation",
          template: "confirm",
          context: { confirmUrl }
        })
      )
    } catch (error) {
      throw new SendConfirmationMailException(
        `Failed to send confirmation email for ${subscription.email}`
      )
    }
  }
}
