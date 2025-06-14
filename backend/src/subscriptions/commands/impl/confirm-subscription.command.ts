import { Command } from "@nestjs/cqrs"
import { Subscription } from "../../models/subscription.model"

export class ConfirmSubscriptionCommand extends Command<Subscription> {
  constructor(public readonly confirmationToken: string) {
    super()
  }
}
