import { Injectable, NestMiddleware } from "@nestjs/common"
import { Request, Response, NextFunction } from "express"
import { v4 as uuidv4 } from "uuid"

const REQUEST_ID_HEADER = "x-request-id"

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let requestId = req.headers[REQUEST_ID_HEADER] as string
    if (!requestId) {
      requestId = uuidv4()
    }
    req[REQUEST_ID_HEADER] = requestId
    res.setHeader(REQUEST_ID_HEADER, requestId)
    next()
  }
}

export { REQUEST_ID_HEADER }
