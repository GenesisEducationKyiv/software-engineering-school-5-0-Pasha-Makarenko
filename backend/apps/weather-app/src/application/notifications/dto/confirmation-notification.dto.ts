import { NotificationDto } from "./notification.dto"
import { ConfirmContextDto } from "../../subscriptions/dto/confirm-context.dto"

export class ConfirmationNotificationDto extends NotificationDto {
  readonly context: ConfirmContextDto
}
