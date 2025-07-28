import { Injectable } from "@nestjs/common"
import {
  CacheMetricsType,
  ICacheMetricsService
} from "../../../application/metrics/interfaces/cache-metrics.interface"
import { Counter } from "prom-client"
import { InjectMetric } from "@willsoto/nestjs-prometheus"
import { NotificationTemplate } from "../../../../../notifications/src/domain/notifications/enums/notification-template.enum"

@Injectable()
export class CacheMetricsService implements ICacheMetricsService {
  constructor(
    @InjectMetric(CacheMetricsType.CACHE_HITS_TOTAL)
    private cacheHits: Counter<string>,
    @InjectMetric(CacheMetricsType.CACHE_MISSES_TOTAL)
    private cacheMisses: Counter<string>
  ) {}

  recordCacheHit(cacheName: NotificationTemplate) {
    this.cacheHits.inc({ cache_name: cacheName })
  }

  recordCacheMiss(cacheName: NotificationTemplate) {
    this.cacheMisses.inc({ cache_name: cacheName })
  }
}
