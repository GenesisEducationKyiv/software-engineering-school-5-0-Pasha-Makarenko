import {
  BaseException,
  SerializedException
} from "../../shared/exceptions/base.exception"
import { HttpStatus } from "@nestjs/common"

export class InvalidConfirmationTokenException extends BaseException {
  public readonly statusCode = HttpStatus.BAD_REQUEST
  public readonly code = "INVALID_CONFIRMATION_TOKEN"

  constructor(message = "Invalid or expired confirmation token") {
    super(message)
  }

  serialize(): SerializedException {
    return {
      code: this.code,
      message: this.message
    }
  }
}
