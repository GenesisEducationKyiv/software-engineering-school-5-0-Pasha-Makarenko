import { HttpStatus, Logger } from "@nestjs/common"
import { UnauthorizedException } from "../../../infrastructure/common/exceptions/unauthorized.exception"
import { ExceptionHandler } from "../../../infrastructure/common/interfaces/exception.handler.interface"

export class UnauthorizedExceptionFilter
  implements ExceptionHandler<UnauthorizedException>
{
  private readonly logger = new Logger(UnauthorizedExceptionFilter.name)

  handle(exception: UnauthorizedException) {
    this.logger.warn(
      `UnauthorizedException: ${exception.message} - ${exception.stack || ""}`
    )

    return {
      status: HttpStatus.UNAUTHORIZED,
      message: exception.message || "Unauthorized access",
      details: exception?.details
    }
  }
}
