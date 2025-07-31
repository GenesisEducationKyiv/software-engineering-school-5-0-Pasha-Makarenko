import { makeCounterProvider } from "@willsoto/nestjs-prometheus"
import { SubscriptionsMetricsType } from "../../../application/metrics/interfaces/subscriptions-metrics.interface"

export const subscriptionsMetricsProviders = [
  makeCounterProvider({
    name: SubscriptionsMetricsType.SUBSCRIPTIONS_CREATED_TOTAL,
    help: "Total number of created subscriptions",
    labelNames: ["city", "frequency"]
  }),
  makeCounterProvider({
    name: SubscriptionsMetricsType.SUBSCRIPTIONS_CREATED_ERRORS,
    help: "Total number of errors when creating subscriptions",
    labelNames: ["city", "frequency"]
  }),
  makeCounterProvider({
    name: SubscriptionsMetricsType.SUBSCRIPTIONS_CONFIRMED_TOTAL,
    help: "Total number of confirmed subscriptions",
    labelNames: ["city", "frequency"]
  }),
  makeCounterProvider({
    name: SubscriptionsMetricsType.SUBSCRIPTIONS_CONFIRMED_ERRORS,
    help: "Total number of errors when confirming subscriptions",
    labelNames: ["city", "frequency"]
  }),
  makeCounterProvider({
    name: SubscriptionsMetricsType.SUBSCRIPTIONS_UNSUBSCRIBED_TOTAL,
    help: "Total number of unsubscribed subscriptions",
    labelNames: ["city", "frequency"]
  }),
  makeCounterProvider({
    name: SubscriptionsMetricsType.SUBSCRIPTIONS_UNSUBSCRIBED_ERRORS,
    help: "Total number of errors when unsubscribing subscriptions",
    labelNames: ["city", "frequency"]
  })
]
