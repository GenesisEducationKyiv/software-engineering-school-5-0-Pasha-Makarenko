import { CommandBus, EventsHandler, IEventHandler } from "@nestjs/cqrs"
import { SubscriptionCreatedEvent } from "../impl/subscription-created.event"
import { Logger } from "@nestjs/common"
import { UrlGeneratorService } from "../../../url-generator/services/url-generator.service"
import { SendMailCommand } from "../../../mail/commands/impl/send-mail.command"

@EventsHandler(SubscriptionCreatedEvent)
export class SubscriptionCreatedHandler
  implements IEventHandler<SubscriptionCreatedEvent>
{
  private logger = new Logger(SubscriptionCreatedHandler.name)

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
      this.logger.error("Failed to send confirmation email:", error.message)
    }
  }
}
