import {
  makeCounterProvider,
  makeGaugeProvider,
  makeHistogramProvider
} from "@willsoto/nestjs-prometheus"
import { SearchMetricsType } from "../../../application/metrics/interfaces/search-metrics.interface"

export const searchMetricsProviders = [
  makeCounterProvider({
    name: SearchMetricsType.SEARCH_REQUESTS_TOTAL,
    help: "Total number of search requests",
    labelNames: ["query"]
  }),
  makeCounterProvider({
    name: SearchMetricsType.SEARCH_REQUESTS_ERRORS,
    help: "Total number of search request errors",
    labelNames: ["query"]
  }),
  makeHistogramProvider({
    name: SearchMetricsType.SEARCH_REQUEST_DURATION,
    help: "Search request duration in seconds",
    labelNames: ["query"],
    buckets: [0.1, 0.5, 1, 2, 5, 10]
  }),
  makeGaugeProvider({
    name: SearchMetricsType.SEARCH_REQUESTS_IN_PROGRESS,
    help: "Number of search requests currently in progress",
    labelNames: ["query"]
  })
]
