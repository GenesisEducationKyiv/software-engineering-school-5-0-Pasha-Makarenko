import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common"
import { ExceptionHandler } from "../../../infrastructure/common/interfaces/exception.handler.interface"
import { BaseException } from "../../../main/exceptions/base.exception"

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private filters: Map<string, ExceptionHandler<unknown>>) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    let status = 500
    let message = "Internal server error"
    let details: unknown = undefined

    if (exception instanceof BaseException) {
      const filter = this.filters.get(exception.code)

      if (filter) {
        const result = filter.handle(exception, host)
        status = result.status
        message = result.message
        details = result.details
      }
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message
    }

    if (details) {
      errorResponse["details"] = details
    }

    response.status(status).json(errorResponse)
  }
}
