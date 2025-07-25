import { MailerService } from "@nestjs-modules/mailer"
import { ConfigService } from "@nestjs/config"
import { IEmailMetricsService } from "../../metrics/interfaces/email-metrics.interface"
import { EmailSendNotificationDecorator } from "../decorators/email-send-notification.decorator"
import { EmailSendNotificationStrategy } from "../strategies/email-send-notification.strategy"

export const EMAIL_SEND_NOTIFICATION_STRATEGY =
  "EMAIL_SEND_NOTIFICATION_STRATEGY"

export const emailSendNotificationFactory = (
  mailerService: MailerService,
  configService: ConfigService,
  emailMetricsService: IEmailMetricsService
) => {
  return new EmailSendNotificationDecorator(
    new EmailSendNotificationStrategy(mailerService, configService),
    emailMetricsService
  )
}
