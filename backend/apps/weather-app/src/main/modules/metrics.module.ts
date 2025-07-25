import { Module } from "@nestjs/common"
import {
  HTTP_METRICS_SERVICE,
  HttpMetricsService
} from "../../infrastructure/metrics/services/http-metrics.service"
import {
  CACHE_METRICS_SERVICE,
  CacheMetricsService
} from "../../infrastructure/metrics/services/cache-metrics.service"
import { PrometheusModule } from "@willsoto/nestjs-prometheus"
import { httpMetricsProviders } from "../../infrastructure/metrics/providers/http-metrics.provider"
import { cacheMetricsProviders } from "../../infrastructure/metrics/providers/cache-metrics.provider"

const metricsServices = [
  {
    provide: HTTP_METRICS_SERVICE,
    useClass: HttpMetricsService
  },
  {
    provide: CACHE_METRICS_SERVICE,
    useClass: CacheMetricsService
  }
]

const metricsProviders = [...httpMetricsProviders, ...cacheMetricsProviders]

@Module({
  imports: [
    PrometheusModule.register({
      path: "/metrics"
    })
  ],
  providers: [...metricsProviders, ...metricsServices],
  exports: [...metricsProviders, HTTP_METRICS_SERVICE, CACHE_METRICS_SERVICE]
})
export class MetricsModule {}
