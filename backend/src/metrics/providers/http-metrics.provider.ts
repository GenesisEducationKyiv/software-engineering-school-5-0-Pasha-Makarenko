import {
  makeCounterProvider,
  makeGaugeProvider,
  makeHistogramProvider
} from "@willsoto/nestjs-prometheus"

export enum HttpMetricsType {
  REQUESTS_TOTAL = "http_requests_total",
  REQUEST_DURATION = "http_request_duration_seconds",
  REQUESTS_IN_PROGRESS = "http_requests_in_progress"
}

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
