import { BaseException } from "../../../main/exceptions/base.exception"

export const UNAUTHORIZED_EXCEPTION_CODE = "UNAUTHORIZED_ACCESS"

export class UnauthorizedException extends BaseException {
  public readonly code = UNAUTHORIZED_EXCEPTION_CODE

  constructor(
    message = "Unauthorized access",
    public details?: unknown
  ) {
    super(message)
  }

  serialize() {
    return {
      message: this.message,
      details: this.details
    }
  }
}
