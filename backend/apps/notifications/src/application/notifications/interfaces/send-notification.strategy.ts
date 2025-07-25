import { NotificationTemplate } from "../../../domain/notifications/enums/notification-template.enum"

export const NOTIFICATION_STRATEGY = "NotificationStrategy"

export enum NotificationStrategyType {
  EMAIL = "email"
}

export interface SendNotificationStrategy<T> {
  send(
    recipients: string[],
    subject: string,
    context: T,
    template: NotificationTemplate
  ): Promise<void>
}
