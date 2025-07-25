import { BaseException } from "../../../main/exceptions/base.exception"

export const NOT_FOUND_NOTIFICATION_STRATEGY = "NOT_FOUND_NOTIFICATION_STRATEGY"

export class NotFoundNotificationStrategyException extends BaseException {
  public readonly code = NOT_FOUND_NOTIFICATION_STRATEGY

  constructor(type: string) {
    super(`No notification strategy found for type: ${type}`)
  }

  serialize() {
    return {
      message: this.message
    }
  }
}
