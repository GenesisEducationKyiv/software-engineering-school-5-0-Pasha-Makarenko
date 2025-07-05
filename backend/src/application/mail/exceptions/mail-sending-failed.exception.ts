import {
  BaseException,
  SerializedException
} from "../../../main/exceptions/base.exception"
import { HttpStatus } from "@nestjs/common"

export class MailSendingFailedException extends BaseException {
  public readonly statusCode = HttpStatus.INTERNAL_SERVER_ERROR
  public readonly code = "MAIL_SENDING_FAILED"

  constructor(
    message = "Failed to send email",
    public readonly details?: unknown
  ) {
    super(message)
  }

  serialize(): SerializedException {
    return {
      code: this.code,
      message: this.message,
      details: this.details
    }
  }
}
