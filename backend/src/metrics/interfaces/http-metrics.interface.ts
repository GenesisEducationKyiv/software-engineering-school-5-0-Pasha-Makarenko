import { HttpStatus } from "@nestjs/common"

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
