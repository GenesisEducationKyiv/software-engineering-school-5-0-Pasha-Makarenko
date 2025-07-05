import {
  BaseException,
  SerializedException
} from "../../../main/exceptions/base.exception"
import { HttpStatus } from "@nestjs/common"

export class SubscriptionAlreadyConfirmedException extends BaseException {
  public readonly statusCode = HttpStatus.BAD_REQUEST
  public readonly code = "SUBSCRIPTION_ALREADY_CONFIRMED"

  constructor(message = "Subscription is already confirmed") {
    super(message)
  }

  serialize(): SerializedException {
    return {
      code: this.code,
      message: this.message
    }
  }
}
