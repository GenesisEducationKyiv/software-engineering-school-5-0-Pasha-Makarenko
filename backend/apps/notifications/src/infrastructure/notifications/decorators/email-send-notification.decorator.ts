import { SendNotificationStrategy } from "../../../application/notifications/interfaces/send-notification.strategy"
import { IEmailMetricsService } from "../../metrics/interfaces/email-metrics.interface"
import { EMAIL_SEND_NOTIFICATION_STRATEGY } from "../factories/email-send-notification.factory"
import { Logger } from "@nestjs/common"
import { NotificationTemplate } from "../../../domain/notifications/enums/notification-template.enum"
import { NotificationContext } from "../../../application/notifications/interfaces/context.interface"

export class EmailSendNotificationDecorator<T extends NotificationContext>
  implements SendNotificationStrategy<T>
{
  private readonly logger = new Logger(EMAIL_SEND_NOTIFICATION_STRATEGY)

  constructor(
    private strategy: SendNotificationStrategy<T>,
    private emailMetricsService: IEmailMetricsService
  ) {}

  async send(
    recipients: string[],
    subject: string,
    context: T,
    template: NotificationTemplate
  ): Promise<void> {
    this.logger.log(`Sending email to: ${recipients.join(", ")}`)

    try {
      await this.strategy.send(recipients, subject, context, template)
      this.emailMetricsService.recordEmailSent(template)
      this.logger.log(`Email sent successfully to: ${recipients.join(", ")}`)
    } catch (error) {
      this.emailMetricsService.recordEmailFailed(template)
      this.logger.error(
        `Failed to send email to: ${recipients.join(", ")}`,
        error.stack
      )
      throw error
    }
  }
}
