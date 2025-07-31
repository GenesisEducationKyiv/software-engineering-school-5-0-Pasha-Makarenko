import { Frequency } from "../../../domain/subscriptions/enums/frequency.enum"

export const SUBSCRIPTIONS_METRICS_SERVICE = "SUBSCRIPTIONS_METRICS_SERVICE"

export enum SubscriptionsMetricsType {
  SUBSCRIPTIONS_CREATED_TOTAL = "subscriptions_created_total",
  SUBSCRIPTIONS_CREATED_ERRORS = "subscriptions_created_errors",
  SUBSCRIPTIONS_CONFIRMED_TOTAL = "subscriptions_confirmed_total",
  SUBSCRIPTIONS_CONFIRMED_ERRORS = "subscriptions_confirmed_errors",
  SUBSCRIPTIONS_UNSUBSCRIBED_TOTAL = "subscriptions_unsubscribed_total",
  SUBSCRIPTIONS_UNSUBSCRIBED_ERRORS = "subscriptions_unsubscribed_errors"
}

export interface ISubscriptionsMetricsService {
  recordSubscriptionCreated(city: string, frequency: Frequency): void

  recordSubscriptionCreatedError(city: string, frequency: Frequency): void

  recordSubscriptionConfirmed(city: string, frequency: Frequency): void

  recordSubscriptionConfirmedError(city: string, frequency: Frequency): void

  recordSubscriptionUnsubscribed(city: string, frequency: Frequency): void

  recordSubscriptionUnsubscribedError(city: string, frequency: Frequency): void
}
