import { Subscription } from "../subscription.model"

export class SubscriptionCreatedEvent {
  constructor(public readonly subscription: Subscription) {}
}
