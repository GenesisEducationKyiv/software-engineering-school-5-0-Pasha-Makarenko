import { BaseException } from "../../../main/exceptions/base.exception"

export const CONFLICT_EXCEPTION_CODE = "CONFLICT"

export class ConflictException extends BaseException {
  public readonly code = CONFLICT_EXCEPTION_CODE

  constructor(message = "Conflict occurred") {
    super(message)
  }

  serialize() {
    return {
      message: this.message
    }
  }
}
