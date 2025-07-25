import { HttpStatus, Logger } from "@nestjs/common"
import { ConflictException } from "../../../domain/common/exceptions/conflict.exception"
import { ExceptionHandler } from "../../../infrastructure/common/interfaces/exception.handler.interface"

export class ConflictExceptionFilter
  implements ExceptionHandler<ConflictException>
{
  private logger = new Logger(ConflictExceptionFilter.name)

  handle(exception: ConflictException) {
    this.logger.warn(
      `ConflictException: ${exception.message} - ${exception.stack || ""}`
    )

    return {
      status: HttpStatus.CONFLICT,
      message: exception.message || "Conflict occurred"
    }
  }
}
