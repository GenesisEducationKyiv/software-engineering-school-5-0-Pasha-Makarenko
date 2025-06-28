import {
  BaseException,
  SerializedException
} from "../../shared/exceptions/base.exception"
import { HttpStatus } from "@nestjs/common"

export class InvalidUnsubscribeTokenException extends BaseException {
  public readonly statusCode = HttpStatus.BAD_REQUEST
  public readonly code = "INVALID_UNSUBSCRIBE_TOKEN"

  constructor(message = "Invalid or expired unsubscribe token") {
    super(message)
  }

  serialize(): SerializedException {
    return {
      code: this.code,
      message: this.message
    }
  }
}
