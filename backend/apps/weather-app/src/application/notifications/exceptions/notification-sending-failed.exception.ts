import {
  BaseException,
  SerializedException
} from "../../../main/exceptions/base.exception"

export const NOTIFICATION_SENDING_FAILED_EXCEPTION_CODE =
  "NOTIFICATION_SENDING_FAILED"

export class NotificationSendingFailedException extends BaseException {
  public readonly code = NOTIFICATION_SENDING_FAILED_EXCEPTION_CODE

  constructor(
    message = "Failed to send notification",
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
