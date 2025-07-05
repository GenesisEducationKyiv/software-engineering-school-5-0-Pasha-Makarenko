import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger
} from "@nestjs/common"
import { Request, Response } from "express"
import { BaseException } from "../../../main/exceptions/base.exception"

interface ExceptionResponse {
  message?: string | string[]
  error?: string
  details?: unknown
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = "Internal server error"
    let code = "INTERNAL_SERVER_ERROR"
    let details: unknown = undefined

    if (exception instanceof BaseException) {
      status = exception.statusCode
      message = exception.message
      code = exception.code
      details = exception.serialize().details
    } else if (exception instanceof HttpException) {
      status = exception.getStatus()
      code = "HTTP_EXCEPTION"
      const exceptionResponse = exception.getResponse()

      if (typeof exceptionResponse === "string") {
        message = exceptionResponse
      } else if (typeof exceptionResponse === "object") {
        const responseObj = exceptionResponse as ExceptionResponse
        message = Array.isArray(responseObj.message)
          ? responseObj.message.join(", ")
          : responseObj.message || exception.message
        code = responseObj.error || "HTTP_EXCEPTION"
        details = responseObj.details
      } else {
        message = exception.message
      }
    }

    const logMessage =
      `${request.method} ${request.url} - ${status} ${code}: ${message}; ${exception instanceof Error ? exception.stack : ""}`.trim()

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(logMessage)
    } else if (status >= HttpStatus.BAD_REQUEST) {
      this.logger.warn(logMessage)
    } else {
      this.logger.log(logMessage)
    }

    const errorResponse: Record<string, unknown> = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      code,
      message
    }

    if (details) {
      errorResponse.details = details
    }

    response.status(status).json(errorResponse)
  }
}
