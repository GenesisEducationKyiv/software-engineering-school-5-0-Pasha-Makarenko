import { Command } from "@nestjs/cqrs"
import { Frequency } from "../../../../domain/subscriptions/enums/frequency.enum"

export class SendWeatherCommand extends Command<void> {
  constructor(public readonly frequency: Frequency) {
    super()
  }
}
