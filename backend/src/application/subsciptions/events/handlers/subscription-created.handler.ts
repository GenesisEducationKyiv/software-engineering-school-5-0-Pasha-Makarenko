import { CommandBus, EventsHandler, IEventHandler } from "@nestjs/cqrs"
import { SubscriptionCreatedEvent } from "../impl/subscription-created.event"
import { SendMailCommand } from "../../../mail/commands/impl/send-mail.command"
import { SendConfirmationMailException } from "../../exceptions/send-confirmation-mail.exception"
import { Inject } from "@nestjs/common"
import {
  IUrlGeneratorService,
  URL_GENERATOR_SERVICE
} from "../../../../infrastructure/url-generator/interfaces/url-generator.interfaces"

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

    try {
      const confirmUrl = this.urlGeneratorService.confirmUrl(
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
