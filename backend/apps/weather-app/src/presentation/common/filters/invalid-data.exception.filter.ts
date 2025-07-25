import { HttpStatus, Logger } from "@nestjs/common"
import { InvalidDataException } from "../../../domain/common/exceptions/invalid-data.exception"
import { ExceptionHandler } from "../../../infrastructure/common/interfaces/exception.handler.interface"

export class InvalidDataExceptionFilter
  implements ExceptionHandler<InvalidDataException>
{
  private readonly logger = new Logger(InvalidDataExceptionFilter.name)

  handle(exception: InvalidDataException) {
    this.logger.warn(
      `InvalidDataException: ${exception.message} - ${exception.stack || ""}`
    )

    return {
      status: HttpStatus.BAD_REQUEST,
      message: exception.message
    }
  }
}
