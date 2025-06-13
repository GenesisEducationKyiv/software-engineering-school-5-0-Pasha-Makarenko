import { Frequency } from "../../subscriptions/subscription.model"

export class SendWeatherCommand {
  constructor(public readonly frequency: Frequency) {}
}
