import { Subscription } from "../subscription.model"

export class GetActiveSubscriptionsQuery {
  constructor(public readonly where: Partial<Subscription>) {}
}
