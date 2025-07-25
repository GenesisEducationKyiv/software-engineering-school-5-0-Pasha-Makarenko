import { Subscription } from "../../../../domain/subscriptions/entities/subscription.entity"

export class SubscriptionCreatedEvent {
  constructor(public readonly subscription: Subscription) {}
}
