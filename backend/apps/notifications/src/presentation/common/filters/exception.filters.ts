import { ExceptionHandler } from "../../../infrastructure/common/interfaces/exception.handler.interface"
import { INVALID_DATA_EXCEPTION_CODE } from "../../../domain/common/exceptions/invalid-data.exception"
import { InvalidDataExceptionFilter } from "./invalid-data.exception.filter"
import { NOT_FOUND_NOTIFICATION_STRATEGY } from "../../../application/notifications/exceptions/not-found-notification-strategy.exception"
import { NotFoundNotificationStrategyExceptionFilter } from "./not-found-notification-strategy.exception.filter"

export const exceptionFilters = new Map<string, ExceptionHandler<unknown>>()
exceptionFilters.set(
  INVALID_DATA_EXCEPTION_CODE,
  new InvalidDataExceptionFilter()
)
exceptionFilters.set(
  NOT_FOUND_NOTIFICATION_STRATEGY,
  new NotFoundNotificationStrategyExceptionFilter()
)
