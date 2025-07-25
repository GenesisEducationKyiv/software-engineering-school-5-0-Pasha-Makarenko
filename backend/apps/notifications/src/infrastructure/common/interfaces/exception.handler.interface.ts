import { ArgumentsHost } from "@nestjs/common"

export interface ExceptionHandlerMetadata {
  status: number
  message: string
  details?: unknown
}

export interface ExceptionHandler<T> {
  handle(exception: T, host?: ArgumentsHost): ExceptionHandlerMetadata
}
