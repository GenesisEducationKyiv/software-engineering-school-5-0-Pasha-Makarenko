import { NotificationTemplate } from "../../../domain/notifications/enums/notification-template.enum"

export const EmailMetricsType = {
  EMAIL_SENT_TOTAL: "email_sent_total",
  EMAIL_FAILED_TOTAL: "email_failed_total"
}

export interface IEmailMetricsService {
  recordEmailSent(emailType: NotificationTemplate): void

  recordEmailFailed(emailType: NotificationTemplate, error?: unknown): void
}
