import { BaseException } from "../../../main/exceptions/base.exception"

export const TRANSACTION_EXCEPTION_CODE = "TRANSACTION_ERROR"

export class TransactionException extends BaseException {
  public readonly code = TRANSACTION_EXCEPTION_CODE

  constructor(
    message = "Transaction failed",
    public details?: unknown
  ) {
    super(message)
  }

  serialize() {
    return {
      message: this.message,
      details: this.details
    }
  }
}
