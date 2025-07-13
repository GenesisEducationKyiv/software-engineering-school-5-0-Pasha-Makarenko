import { HttpStatus, Logger } from "@nestjs/common"
import { ExceptionHandler } from "../../../infrastructure/common/interfaces/exception.handler.interface"
import { NotificationSendingFailedException } from "../../../application/notifications/exceptions/notification-sending-failed.exception"

export class NotificationSendingFailedExceptionFilter
  implements ExceptionHandler<NotificationSendingFailedException>
{
  private readonly logger = new Logger(
    NotificationSendingFailedExceptionFilter.name
  )

  handle(exception: NotificationSendingFailedException) {
    this.logger.error(
      `MailSendingFailedException: ${exception.message} - ${exception.stack || ""}`
    )

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.message || "Mail sending failed",
      details: exception?.details
    }
  }
}
