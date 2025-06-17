import { Frequency } from "../../../subscriptions/models/subscription.model"

export class SendWeatherCommand {
  constructor(public readonly frequency: Frequency) {}
}
