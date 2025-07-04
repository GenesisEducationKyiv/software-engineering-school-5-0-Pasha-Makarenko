import { HttpStatus, Injectable } from "@nestjs/common"
import { IHttpMetricsService } from "../interfaces/http-metrics.interface"
import { Counter, Gauge, Histogram } from "prom-client"
import { InjectMetric } from "@willsoto/nestjs-prometheus"
import { HttpMetricsType } from "../providers/http-metrics.provider"

export const HTTP_METRICS_SERVICE = "HTTP_METRICS_SERVICE"

@Injectable()
export class HttpMetricsService implements IHttpMetricsService {
  constructor(
    @InjectMetric(HttpMetricsType.REQUESTS_TOTAL)
    private httpRequestsTotal: Counter<string>,
    @InjectMetric(HttpMetricsType.REQUEST_DURATION)
    private httpRequestDuration: Histogram<string>,
    @InjectMetric(HttpMetricsType.REQUESTS_IN_PROGRESS)
    private httpRequestsInProgress: Gauge<string>
  ) {}

  recordHttpRequest(
    method: string,
    route: string,
    statusCode: HttpStatus,
    duration: number
  ) {
    this.httpRequestsTotal.inc({
      method,
      route,
      status_code: statusCode.toString()
    })
    this.httpRequestDuration.observe({ method, route }, duration)
  }

  startHttpRequest(method: string, route: string) {
    this.httpRequestsInProgress.inc({ method, route })
  }

  endHttpRequest(method: string, route: string) {
    this.httpRequestsInProgress.dec({ method, route })
  }
}
