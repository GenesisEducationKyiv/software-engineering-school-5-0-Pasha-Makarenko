import { HttpStatus, Logger } from "@nestjs/common"
import { ExceptionHandler } from "../../../infrastructure/common/interfaces/exception.handler.interface"
import { NotFoundNotificationStrategyException } from "../../../application/notifications/exceptions/not-found-notification-strategy.exception"

export class NotFoundNotificationStrategyExceptionFilter
  implements ExceptionHandler<NotFoundNotificationStrategyException>
{
  private readonly logger = new Logger(
    NotFoundNotificationStrategyExceptionFilter.name
  )

  handle(exception: NotFoundNotificationStrategyException) {
    this.logger.error(
      `NotFoundNotificationStrategyException: ${exception.message} - ${exception.stack || ""}`
    )

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.message || "Mail sending failed"
    }
  }
}
