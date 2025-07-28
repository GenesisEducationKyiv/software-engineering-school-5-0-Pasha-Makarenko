import {
  makeCounterProvider,
  makeGaugeProvider,
  makeHistogramProvider
} from "@willsoto/nestjs-prometheus"
import { HttpMetricsType } from "../../../application/metrics/interfaces/http-metrics.interface"

export const httpMetricsProviders = [
  makeCounterProvider({
    name: HttpMetricsType.REQUESTS_TOTAL,
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status_code"]
  }),
  makeHistogramProvider({
    name: HttpMetricsType.REQUEST_DURATION,
    help: "HTTP request duration in seconds",
    labelNames: ["method", "route"],
    buckets: [0.1, 0.5, 1, 2, 5, 10]
  }),
  makeGaugeProvider({
    name: HttpMetricsType.REQUESTS_IN_PROGRESS,
    help: "Number of HTTP requests currently in progress",
    labelNames: ["method", "route"]
  })
]
