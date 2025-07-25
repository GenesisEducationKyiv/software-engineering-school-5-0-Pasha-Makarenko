import { ConfirmContextDto } from "../../../src/application/notifications/dto/confirmation-notification.dto"
import { NotificationStrategyType } from "../../../src/application/notifications/interfaces/send-notification.strategy"

export const confirmationNotificationDtoMock = {
  recipients: ["a@b.c"],
  subject: "subj",
  type: NotificationStrategyType.EMAIL,
  context: {
    confirmUrl: "https://example.com/confirm/123"
  } as ConfirmContextDto
}
