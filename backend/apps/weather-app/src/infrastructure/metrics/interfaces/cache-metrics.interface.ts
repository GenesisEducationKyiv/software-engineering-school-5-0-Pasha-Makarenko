export enum CacheMetricsType {
  CACHE_HITS_TOTAL = "cache_hits_total",
  CACHE_MISSES_TOTAL = "cache_misses_total"
}

export interface ICacheMetricsService {
  recordCacheHit(cacheName: string): void

  recordCacheMiss(cacheName: string): void
}
