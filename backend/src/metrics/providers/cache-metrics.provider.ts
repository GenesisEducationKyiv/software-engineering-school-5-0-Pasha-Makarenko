import { makeCounterProvider } from "@willsoto/nestjs-prometheus"

export enum CacheMetricsType {
  CACHE_HITS_TOTAL = "cache_hits_total",
  CACHE_MISSES_TOTAL = "cache_misses_total"
}

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
