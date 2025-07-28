import { Inject, Injectable, NestMiddleware } from "@nestjs/common"
import { NextFunction, Request, Response } from "express"
import {
  IHttpMetricsService,
  HTTP_METRICS_SERVICE
} from "../../../application/metrics/interfaces/http-metrics.interface"

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(
    @Inject(HTTP_METRICS_SERVICE)
    private httpMetricsService: IHttpMetricsService
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now()
    const method = req.method
    const route = req.route ? req.route.path : req.path.split("?")[0]

    this.httpMetricsService.startHttpRequest(method, route)

    res.on("finish", () => {
      const duration = (Date.now() - startTime) / 1000
      const statusCode = res.statusCode

      this.httpMetricsService.recordHttpRequest(
        method,
        route,
        statusCode,
        duration
      )
      this.httpMetricsService.endHttpRequest(method, route)
    })

    next()
  }
}
