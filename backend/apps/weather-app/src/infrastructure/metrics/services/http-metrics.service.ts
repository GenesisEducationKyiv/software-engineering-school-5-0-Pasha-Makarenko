import { HttpStatus, Injectable } from "@nestjs/common"
import {
  HttpMetricsType,
  IHttpMetricsService
} from "../../../application/metrics/interfaces/http-metrics.interface"
import { Counter, Gauge, Histogram } from "prom-client"
import { InjectMetric } from "@willsoto/nestjs-prometheus"

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
