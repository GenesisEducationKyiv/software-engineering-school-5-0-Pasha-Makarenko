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
import { subscriptionsMetricsProviders } from "../../infrastructure/metrics/providers/subscriptions-metrics.provider"
import { SCHEDULER_METRICS_SERVICE } from "../../application/metrics/interfaces/scheduler-metrics.interface"
import { SchedulerMetricsService } from "../../infrastructure/metrics/services/scheduler-metrics.service"
import { WEATHER_METRICS_SERVICE } from "../../application/metrics/interfaces/weather-metrics.interface"
import { WeatherMetricsService } from "../../infrastructure/metrics/services/weather-metrics.service"
import { SEARCH_METRICS_SERVICE } from "../../application/metrics/interfaces/search-metrics.interface"
import { SearchMetricsService } from "../../infrastructure/metrics/services/search-service.service"
import { schedulerMetricsProviders } from "../../infrastructure/metrics/providers/scheduler-metrics.provider"
import { weatherMetricsProviders } from "../../infrastructure/metrics/providers/weather-metrics.provider"
import { searchMetricsProviders } from "../../infrastructure/metrics/providers/search-metrics.provider"

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
    provide: SCHEDULER_METRICS_SERVICE,
    useClass: SchedulerMetricsService
  },
  {
    provide: SUBSCRIPTIONS_METRICS_SERVICE,
    useClass: SubscriptionsMetricsService
  },
  {
    provide: WEATHER_METRICS_SERVICE,
    useClass: WeatherMetricsService
  },
  {
    provide: SEARCH_METRICS_SERVICE,
    useClass: SearchMetricsService
  }
]

const metricsProviders = [
  ...httpMetricsProviders,
  ...cacheMetricsProviders,
  ...schedulerMetricsProviders,
  ...subscriptionsMetricsProviders,
  ...weatherMetricsProviders,
  ...searchMetricsProviders
]

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
