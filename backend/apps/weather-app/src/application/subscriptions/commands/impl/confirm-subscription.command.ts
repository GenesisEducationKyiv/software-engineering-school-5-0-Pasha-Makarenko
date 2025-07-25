import { Command } from "@nestjs/cqrs"

export class ConfirmSubscriptionCommand extends Command<void> {
  constructor(public readonly confirmationToken: string) {
    super()
  }
}
