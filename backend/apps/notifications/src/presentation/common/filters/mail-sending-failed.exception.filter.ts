import { HttpStatus, Logger } from "@nestjs/common"
import { ExceptionHandler } from "../../../infrastructure/common/interfaces/exception.handler.interface"
import { MailSendingFailedException } from "../../../application/notifications/exceptions/mail-sending-failed.exception"

export class MailSendingFailedExceptionFilter
  implements ExceptionHandler<MailSendingFailedException>
{
  private readonly logger = new Logger(MailSendingFailedExceptionFilter.name)

  handle(exception: MailSendingFailedException) {
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
