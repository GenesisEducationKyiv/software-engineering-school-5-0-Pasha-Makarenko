import { Module } from "@nestjs/common"
import {
  HTTP_METRICS_SERVICE,
  HttpMetricsService
} from "./services/http-metrics.service"
import {
  CACHE_METRICS_SERVICE,
  CacheMetricsService
} from "./services/cache-metrics.service"
import { PrometheusModule } from "@willsoto/nestjs-prometheus"
import { httpMetricsProviders } from "./providers/http-metrics.provider"
import { cacheMetricsProviders } from "./providers/cache-metrics.provider"

const metrics = [
  {
    provide: HTTP_METRICS_SERVICE,
    useClass: HttpMetricsService
  },
  {
    provide: CACHE_METRICS_SERVICE,
    useClass: CacheMetricsService
  }
]

@Module({
  imports: [
    PrometheusModule.register({
      path: "/metrics"
    })
  ],
  providers: [...httpMetricsProviders, ...cacheMetricsProviders, ...metrics],
  exports: [
    ...httpMetricsProviders,
    ...cacheMetricsProviders,
    HTTP_METRICS_SERVICE,
    CACHE_METRICS_SERVICE
  ]
})
export class MetricsModule {}
