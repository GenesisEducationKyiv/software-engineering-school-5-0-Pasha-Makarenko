import { SendNotificationStrategy } from "../../../application/notifications/interfaces/send-notification.strategy"
import { WeatherContextDto } from "../../../application/notifications/dto/weather-notification.dto"
import { NotificationTemplate } from "../../../domain/notifications/enums/notification-template.enum"
import { MailerService } from "@nestjs-modules/mailer"
import { ConfigService } from "@nestjs/config"
import { MailSendingFailedException } from "../../../application/notifications/exceptions/mail-sending-failed.exception"

export class EmailSendNotificationStrategy
  implements SendNotificationStrategy<WeatherContextDto>
{
  private readonly from: string

  constructor(
    private mailerService: MailerService,
    private configService: ConfigService
  ) {
    this.from = this.configService.get<string>("SMTP_USER")!
  }

  async send(
    recipients: string[],
    subject: string,
    context: WeatherContextDto,
    template: NotificationTemplate
  ) {
    try {
      await this.mailerService.sendMail({
        to: recipients,
        from: this.from,
        subject,
        template,
        context
      })
    } catch (error) {
      throw new MailSendingFailedException("Failed to send email", error)
    }
  }
}
