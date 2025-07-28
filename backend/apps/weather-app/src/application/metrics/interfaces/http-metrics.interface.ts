import { HttpStatus } from "@nestjs/common"

export const HTTP_METRICS_SERVICE = "HTTP_METRICS_SERVICE"

export enum HttpMetricsType {
  REQUESTS_TOTAL = "http_requests_total",
  REQUEST_DURATION = "http_request_duration_seconds",
  REQUESTS_IN_PROGRESS = "http_requests_in_progress"
}

export interface IHttpMetricsService {
  recordHttpRequest(
    method: string,
    route: string,
    statusCode: HttpStatus,
    duration: number
  ): void

  startHttpRequest(method: string, route: string): void

  endHttpRequest(method: string, route: string): void
}
