import { Command } from "@nestjs/cqrs"

export class CleanUpSubscriptionsCommand extends Command<void> {
  constructor(public readonly ttl: number) {
    super()
  }
}
