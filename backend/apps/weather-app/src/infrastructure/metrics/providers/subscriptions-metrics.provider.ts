import { makeCounterProvider } from "@willsoto/nestjs-prometheus"
import { SubscriptionsMetricsType } from "../../../application/metrics/interfaces/subscriptions-metrics.interface"

export const subscriptionsMetricsProviders = [
  makeCounterProvider({
    name: SubscriptionsMetricsType.SUBSCRIPTIONS_TOTAL,
    help: "Total number of subscriptions",
    labelNames: ["city", "frequency"]
  }),
  makeCounterProvider({
    name: SubscriptionsMetricsType.SUBSCRIPTIONS_CONFIRMED,
    help: "Total number of confirmed subscriptions",
    labelNames: ["city", "frequency"]
  }),
  makeCounterProvider({
    name: SubscriptionsMetricsType.SUBSCRIPTIONS_UNSUBSCRIBED,
    help: "Total number of unsubscribed subscriptions",
    labelNames: ["city", "frequency"]
  })
]
