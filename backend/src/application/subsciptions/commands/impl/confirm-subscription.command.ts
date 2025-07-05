import { Command } from "@nestjs/cqrs"
import { Subscription } from "../../../../domain/subscriptions/entities/subscription.entity"

export class ConfirmSubscriptionCommand extends Command<Subscription> {
  constructor(public readonly confirmationToken: string) {
    super()
  }
}
