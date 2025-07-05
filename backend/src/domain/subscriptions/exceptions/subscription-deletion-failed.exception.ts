import {
  BaseException,
  SerializedException
} from "../../../main/exceptions/base.exception"
import { HttpStatus } from "@nestjs/common"

export class SubscriptionDeletionFailedException extends BaseException {
  public readonly statusCode = HttpStatus.INTERNAL_SERVER_ERROR
  public readonly code = "SUBSCRIPTION_DELETION_FAILED"

  constructor(message = "Failed to delete subscription") {
    super(message)
  }

  serialize(): SerializedException {
    return {
      code: this.code,
      message: this.message
    }
  }
}
