import { Frequency } from "../../../domain/subscriptions/enums/frequency.enum"

export const SUBSCRIPTIONS_METRICS_SERVICE = "SUBSCRIPTIONS_METRICS_SERVICE"

export enum SubscriptionsMetricsType {
  SUBSCRIPTIONS_TOTAL = "subscriptions_total",
  SUBSCRIPTIONS_CONFIRMED = "subscriptions_confirmed",
  SUBSCRIPTIONS_UNSUBSCRIBED = "subscriptions_unsubscribed"
}

export interface ISubscriptionsMetricsService {
  recordSubscriptionCreated(city: string, frequency: Frequency): void

  recordSubscriptionConfirmed(city: string, frequency: Frequency): void

  recordSubscriptionUnsubscribed(city: string, frequency: Frequency): void
}
