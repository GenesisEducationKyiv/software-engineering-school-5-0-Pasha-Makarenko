import { ExceptionHandler } from "../../../infrastructure/common/interfaces/exception.handler.interface"
import { CONFLICT_EXCEPTION_CODE } from "../../../domain/common/exceptions/conflict.exception"
import { ConflictExceptionFilter } from "./conflict.exception.filter"
import { INVALID_DATA_EXCEPTION_CODE } from "../../../domain/common/exceptions/invalid-data.exception"
import { InvalidDataExceptionFilter } from "./invalid-data.exception.filter"
import { NOTIFICATION_SENDING_FAILED_EXCEPTION_CODE } from "../../../application/notifications/exceptions/notification-sending-failed.exception"
import { NotificationSendingFailedExceptionFilter } from "./notification-sending-failed.exception.filter"
import { NOT_FOUND_EXCEPTION_CODE } from "../../../domain/common/exceptions/not-found.exception"
import { NotFoundExceptionFilter } from "./not-found.exception.filter"
import { PROVIDER_EXCEPTION_CODE } from "../../../infrastructure/common/exceptions/provider.exception"
import { ProviderExceptionFilter } from "./provider.exception.filter"
import { TRANSACTION_EXCEPTION_CODE } from "../../../infrastructure/common/exceptions/transaction.exception"
import { TransactionExceptionFilter } from "./transaction.exception.filter"
import { UNAUTHORIZED_EXCEPTION_CODE } from "../../../infrastructure/common/exceptions/unauthorized.exception"
import { UnauthorizedExceptionFilter } from "./unauthorized.exception.filter"

export const exceptionFilters = new Map<string, ExceptionHandler<unknown>>()
exceptionFilters.set(
  INVALID_DATA_EXCEPTION_CODE,
  new InvalidDataExceptionFilter()
)
exceptionFilters.set(CONFLICT_EXCEPTION_CODE, new ConflictExceptionFilter())
exceptionFilters.set(
  NOTIFICATION_SENDING_FAILED_EXCEPTION_CODE,
  new NotificationSendingFailedExceptionFilter()
)
exceptionFilters.set(NOT_FOUND_EXCEPTION_CODE, new NotFoundExceptionFilter())
exceptionFilters.set(PROVIDER_EXCEPTION_CODE, new ProviderExceptionFilter())
exceptionFilters.set(
  TRANSACTION_EXCEPTION_CODE,
  new TransactionExceptionFilter()
)
exceptionFilters.set(
  UNAUTHORIZED_EXCEPTION_CODE,
  new UnauthorizedExceptionFilter()
)
