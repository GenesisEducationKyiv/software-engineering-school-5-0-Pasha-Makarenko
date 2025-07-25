import { HttpStatus, Logger } from "@nestjs/common"
import { ProviderException } from "../../../infrastructure/common/exceptions/provider.exception"
import { ExceptionHandler } from "../../../infrastructure/common/interfaces/exception.handler.interface"

export class ProviderExceptionFilter
  implements ExceptionHandler<ProviderException>
{
  private readonly logger = new Logger(ProviderExceptionFilter.name)

  handle(exception: ProviderException) {
    this.logger.error(
      `ProviderException: ${exception.message} - ${exception.stack || ""}`
    )

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.message || "An error occurred with the provider",
      details: exception?.details
    }
  }
}
