import { Module } from "@nestjs/common"
import { HttpMetricsService } from "../../infrastructure/metrics/services/http-metrics.service"
import { CacheMetricsService } from "../../infrastructure/metrics/services/cache-metrics.service"
import { PrometheusModule } from "@willsoto/nestjs-prometheus"
import { httpMetricsProviders } from "../../infrastructure/metrics/providers/http-metrics.provider"
import { cacheMetricsProviders } from "../../infrastructure/metrics/providers/cache-metrics.provider"
import { HTTP_METRICS_SERVICE } from "../../application/metrics/interfaces/http-metrics.interface"
import { CACHE_METRICS_SERVICE } from "../../application/metrics/interfaces/cache-metrics.interface"
import { SUBSCRIPTIONS_METRICS_SERVICE } from "../../application/metrics/interfaces/subscriptions-metrics.interface"
import { SubscriptionsMetricsService } from "../../infrastructure/metrics/services/subscriptions-metrics.service"

const metricsServices = [
  {
    provide: HTTP_METRICS_SERVICE,
    useClass: HttpMetricsService
  },
  {
    provide: CACHE_METRICS_SERVICE,
    useClass: CacheMetricsService
  },
  {
    provide: SUBSCRIPTIONS_METRICS_SERVICE,
    useClass: SubscriptionsMetricsService
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
  exports: [
    ...metricsProviders,
    ...metricsServices.map(service => service.provide)
  ]
})
export class MetricsModule {}
