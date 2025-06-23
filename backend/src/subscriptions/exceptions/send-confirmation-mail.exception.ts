import { BaseException } from "src/shared/exceptions/base.exception"
import { HttpStatus } from "@nestjs/common"

export class SendConfirmationMailException extends BaseException {
  public readonly statusCode = HttpStatus.INTERNAL_SERVER_ERROR
  public readonly code = "SEND_CONFIRMATION_MAIL_ERROR"

  constructor(message: string) {
    super(message)
  }

  serialize() {
    return {
      code: this.code,
      message: this.message
    }
  }
}
