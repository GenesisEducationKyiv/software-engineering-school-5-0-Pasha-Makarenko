import { Module } from "@nestjs/common"
import { PrometheusModule } from "@willsoto/nestjs-prometheus"
import { emailMetricsProviders } from "../../infrastructure/metrics/providers/email-metrics.provider"
import {
  EMAIL_METRICS_SERVICE,
  EmailMetricsService
} from "../../infrastructure/metrics/services/email-metrics.service"

const metricsServices = [
  {
    provide: EMAIL_METRICS_SERVICE,
    useClass: EmailMetricsService
  }
]

const metricsProviders = [...emailMetricsProviders]

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
