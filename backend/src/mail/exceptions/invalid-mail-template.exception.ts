import {
  BaseException,
  SerializedException
} from "../../shared/exceptions/base.exception"
import { HttpStatus } from "@nestjs/common"

export class InvalidMailTemplateException extends BaseException {
  public readonly statusCode = HttpStatus.BAD_REQUEST
  public readonly code = "INVALID_MAIL_TEMPLATE"

  constructor(template: string) {
    super(`Unknown mail template: ${template}`)
  }

  serialize(): SerializedException {
    return {
      code: this.code,
      message: this.message
    }
  }
}
