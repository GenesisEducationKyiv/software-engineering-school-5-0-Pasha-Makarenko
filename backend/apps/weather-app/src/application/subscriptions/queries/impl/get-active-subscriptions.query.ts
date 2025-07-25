import { Query } from "@nestjs/cqrs"
import { Subscription } from "../../../../domain/subscriptions/entities/subscription.entity"
import { Frequency } from "../../../../domain/subscriptions/enums/frequency.enum"

export class GetActiveSubscriptionsQuery extends Query<Subscription[]> {
  constructor(public readonly frequency: Frequency) {
    super()
  }
}
