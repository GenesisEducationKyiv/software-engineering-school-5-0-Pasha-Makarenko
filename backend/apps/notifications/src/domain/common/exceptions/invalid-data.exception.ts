import { BaseException } from "../../../main/exceptions/base.exception"

export const INVALID_DATA_EXCEPTION_CODE = "INVALID_DATA"

export class InvalidDataException extends BaseException {
  public readonly code = INVALID_DATA_EXCEPTION_CODE

  constructor(message = "Invalid data provided") {
    super(message)
  }

  serialize() {
    return {
      message: this.message
    }
  }
}
