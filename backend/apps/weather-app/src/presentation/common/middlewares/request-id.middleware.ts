import { Inject, Injectable, NestMiddleware, Logger } from "@nestjs/common"
import { NextFunction, Request, Response } from "express"
import {
  ITokenService,
  TOKEN_SERVICE
} from "../../../application/common/interfaces/token-service.interface"

const REQUEST_ID_HEADER = "x-request-id"

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestIdMiddleware.name)

  constructor(@Inject(TOKEN_SERVICE) private tokenService: ITokenService) {}

  use(req: Request, res: Response, next: NextFunction) {
    let requestId = req.headers[REQUEST_ID_HEADER] as string
    if (!requestId) {
      requestId = this.tokenService.generate()
      this.logger.debug({
        operation: "generateRequestId",
        message: "Generated new request ID",
        request_id: requestId,
        method: req.method,
        url: req.url
      })
    } else {
      this.logger.debug({
        operation: "useExistingRequestId",
        message: "Using existing request ID",
        request_id: requestId,
        method: req.method,
        url: req.url
      })
    }

    req[REQUEST_ID_HEADER] = requestId
    res.setHeader(REQUEST_ID_HEADER, requestId)
    next()
  }
}

export { REQUEST_ID_HEADER }
