import {
  BaseException,
  SerializedException
} from "../../../main/exceptions/base.exception"
import { HttpStatus } from "@nestjs/common"

export class SubscriptionAlreadyExistsException extends BaseException {
  public readonly statusCode = HttpStatus.CONFLICT
  public readonly code = "SUBSCRIPTION_ALREADY_EXISTS"

  constructor(email: string, city: string) {
    super(`Subscription already exists for email "${email}" and city "${city}"`)
  }

  serialize(): SerializedException {
    return {
      code: this.code,
      message: this.message
    }
  }
}
