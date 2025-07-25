import { HttpStatus, Logger } from "@nestjs/common"
import { NotFoundException } from "../../../domain/common/exceptions/not-found.exception"
import { ExceptionHandler } from "../../../infrastructure/common/interfaces/exception.handler.interface"

export class NotFoundExceptionFilter
  implements ExceptionHandler<NotFoundException>
{
  private readonly logger = new Logger(NotFoundExceptionFilter.name)

  handle(exception: NotFoundException) {
    this.logger.warn(
      `NotFoundException: ${exception.message} - ${exception.stack || ""}`
    )

    return {
      status: HttpStatus.NOT_FOUND,
      message: exception.message || "Not Found"
    }
  }
}
