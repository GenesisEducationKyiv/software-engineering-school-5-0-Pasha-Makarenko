import { HttpStatus, Logger } from "@nestjs/common"
import { TransactionException } from "../../../infrastructure/common/exceptions/transaction.exception"
import { ExceptionHandler } from "../../../infrastructure/common/interfaces/exception.handler.interface"

export class TransactionExceptionFilter
  implements ExceptionHandler<TransactionException>
{
  private readonly logger = new Logger(TransactionExceptionFilter.name)

  handle(exception: TransactionException) {
    this.logger.error(
      `TransactionException: ${exception.message} - ${exception.stack || ""}`
    )

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.message || "An error occurred during the transaction",
      details: exception?.details
    }
  }
}
