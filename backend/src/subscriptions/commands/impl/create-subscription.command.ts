import { CreateSubscriptionDto } from "../../dto/create-subscription.dto"
import { Command } from "@nestjs/cqrs"
import { Subscription } from "../../models/subscription.model"

export class CreateSubscriptionCommand extends Command<Subscription> {
  constructor(public readonly dto: CreateSubscriptionDto) {
    super()
  }
}
