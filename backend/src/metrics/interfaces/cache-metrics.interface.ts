export interface ICacheMetricsService {
  recordCacheHit(cacheName: string): void

  recordCacheMiss(cacheName: string): void
}
