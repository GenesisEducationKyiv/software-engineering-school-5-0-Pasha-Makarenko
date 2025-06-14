import { Subscription } from "../../models/subscription.model"

export class SubscriptionCreatedEvent {
  constructor(public readonly subscription: Subscription) {}
}
