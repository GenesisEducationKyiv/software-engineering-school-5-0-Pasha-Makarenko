import {
  BaseException,
  SerializedException
} from "../../shared/exceptions/base.exception"
import { HttpStatus } from "@nestjs/common"

export class SubscriptionNotFoundException extends BaseException {
  public readonly statusCode = HttpStatus.NOT_FOUND
  public readonly code = "SUBSCRIPTION_NOT_FOUND"

  constructor(message = "Subscription not found") {
    super(message)
  }

  serialize(): SerializedException {
    return {
      code: this.code,
      message: this.message
    }
  }
}
