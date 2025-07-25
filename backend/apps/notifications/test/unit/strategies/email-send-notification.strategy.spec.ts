import { EmailSendNotificationStrategy } from "../../../src/infrastructure/notifications/strategies/email-send-notification.strategy"
import { ConfigService } from "@nestjs/config"
import { MailerService } from "@nestjs-modules/mailer"
import { MailSendingFailedException } from "../../../src/application/notifications/exceptions/mail-sending-failed.exception"
import { ConfirmContextDto } from "../../../src/application/notifications/dto/confirmation-notification.dto"
import { confirmationNotificationDtoMock } from "../../mocks/dto/confirmation-notification.dto.mock"
import { NotificationTemplate } from "../../../src/domain/notifications/enums/notification-template.enum"
import { setupMocks } from "../../mocks/di.mock"

describe("EmailSendNotificationStrategy", () => {
  let strategy: EmailSendNotificationStrategy<ConfirmContextDto>
  let mailerService: jest.Mocked<MailerService>
  let configService: jest.Mocked<ConfigService>

  beforeEach(async () => {
    const mocks = await setupMocks()
    mailerService = mocks.mailerService
    configService = mocks.configService

    strategy = new EmailSendNotificationStrategy<ConfirmContextDto>(
      mailerService,
      configService
    )
  })

  it("should call send with correct params", async () => {
    const { recipients, subject, context } = confirmationNotificationDtoMock
    await strategy.send(
      recipients,
      subject,
      context,
      NotificationTemplate.CONFIRMATION
    )
    expect(mailerService.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: recipients,
        from: configService.get<string>("SMTP_USER"),
        subject,
        template: NotificationTemplate.CONFIRMATION,
        context
      })
    )
  })

  it("should throw error if send fails", async () => {
    const { recipients, subject, context } = confirmationNotificationDtoMock
    const error = new MailSendingFailedException("SMTP error")
    mailerService.sendMail.mockRejectedValue(error)

    await expect(
      strategy.send(
        recipients,
        subject,
        context,
        NotificationTemplate.CONFIRMATION
      )
    ).rejects.toThrow("Failed to send email")
  })
})
