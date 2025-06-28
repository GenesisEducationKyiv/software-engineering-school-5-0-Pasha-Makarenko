import { Frequency, Subscription } from "../../models/subscription.model"
import { Query } from "@nestjs/cqrs"

export class GetActiveSubscriptionsQuery extends Query<Subscription[]> {
  constructor(public readonly frequency: Frequency) {
    super()
  }
}
