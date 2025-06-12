import { EventsHandler, IEventHandler } from "@nestjs/cqrs"
import { SubscriptionCreatedEvent } from "../subscription-created.event"
import { MailService } from "../../../mail/mail.service"
import { Logger } from "@nestjs/common"
import { SubscriptionsService } from "../../subscriptions.service"
import { UrlGeneratorService } from "../../../url-generator/url-generator.service"

@EventsHandler(SubscriptionCreatedEvent)
export class SubscriptionCreatedHandler
  implements IEventHandler<SubscriptionCreatedEvent>
{
  private logger = new Logger(SubscriptionsService.name)

  constructor(
    private urlGeneratorService: UrlGeneratorService,
    private mailService: MailService
  ) {}

  async handle(event: SubscriptionCreatedEvent) {
    const { subscription } = event

    try {
      const confirmUrl = await this.urlGeneratorService.confirmUrl(
        subscription.confirmationToken
      )

      await this.mailService.sendMail({
        emails: [subscription.email],
        subject: "Confirmation",
        template: "confirm",
        context: { confirmUrl }
      })
    } catch (error) {
      this.logger.error("Failed to send confirmation email:", error.message)
    }
  }
}
