import { BaseException } from "../../../main/exceptions/base.exception"

export const PROVIDER_EXCEPTION_CODE = "PROVIDER_ERROR"

export class ProviderException extends BaseException {
  public readonly code = PROVIDER_EXCEPTION_CODE

  constructor(
    message = "Provider error occurred",
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
