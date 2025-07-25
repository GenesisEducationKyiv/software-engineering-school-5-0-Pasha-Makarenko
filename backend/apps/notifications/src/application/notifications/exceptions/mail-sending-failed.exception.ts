import {
  BaseException,
  SerializedException
} from "../../../main/exceptions/base.exception"

export const MAIL_SENDING_FAILED_EXCEPTION_CODE = "MAIL_SENDING_FAILED"

export class MailSendingFailedException extends BaseException {
  public readonly code = MAIL_SENDING_FAILED_EXCEPTION_CODE

  constructor(
    message = "Failed to send email",
    public readonly details?: unknown
  ) {
    super(message)
  }

  serialize(): SerializedException {
    return {
      message: this.message,
      details: this.details
    }
  }
}
