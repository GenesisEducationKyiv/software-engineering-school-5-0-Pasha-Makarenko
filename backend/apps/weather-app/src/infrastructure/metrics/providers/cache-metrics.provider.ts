import { makeCounterProvider } from "@willsoto/nestjs-prometheus"
import { CacheMetricsType } from "../../../application/metrics/interfaces/cache-metrics.interface"

export const cacheMetricsProviders = [
  makeCounterProvider({
    name: CacheMetricsType.CACHE_HITS_TOTAL,
    help: "Total number of cache hits",
    labelNames: ["cache_name"]
  }),
  makeCounterProvider({
    name: CacheMetricsType.CACHE_MISSES_TOTAL,
    help: "Total number of cache misses",
    labelNames: ["cache_name"]
  })
]
