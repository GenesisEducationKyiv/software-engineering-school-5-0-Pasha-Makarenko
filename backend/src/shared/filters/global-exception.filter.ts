import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger
} from "@nestjs/common"
import { Request, Response } from "express"
import { BaseException } from "../exceptions/base.exception"

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

    let status: number
    let message: string
    let code: string
    let details: unknown

    if (exception instanceof BaseException) {
      status = exception.statusCode
      message = exception.message
      code = exception.code
      details = exception.serialize().details
    } else if (exception instanceof HttpException) {
      status = exception.getStatus()
      const exceptionResponse = exception.getResponse()

      if (typeof exceptionResponse === "string") {
        message = exceptionResponse
        code = "HTTP_EXCEPTION"
      } else if (typeof exceptionResponse === "object") {
        const responseObj = exceptionResponse as ExceptionResponse
        message = Array.isArray(responseObj.message)
          ? responseObj.message[0]
          : responseObj.message || exception.message
        code = responseObj.error || "HTTP_EXCEPTION"
        details = responseObj.details
      } else {
        message = exception.message
        code = "HTTP_EXCEPTION"
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR
      message = "Internal server error"
      code = "INTERNAL_SERVER_ERROR"

      this.logger.error(
        `Unhandled exception: ${exception}`,
        exception instanceof Error ? exception.stack : undefined
      )
    }

    this.logger.error(
      `${request.method} ${request.url} - ${status} ${code}: ${message}`,
      exception instanceof Error ? exception.stack : undefined
    )

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
