import { CreateSubscriptionDto } from "../../dto/create-subscription.dto"
import { Command } from "@nestjs/cqrs"

export class CreateSubscriptionCommand extends Command<void> {
  constructor(public readonly dto: CreateSubscriptionDto) {
    super()
  }
}
