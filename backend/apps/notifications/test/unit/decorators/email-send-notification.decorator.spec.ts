import { ConfigService } from "@nestjs/config"
import { MailerService } from "@nestjs-modules/mailer"
import { EmailSendNotificationDecorator } from "../../../src/infrastructure/notifications/decorators/email-send-notification.decorator"
import { NotificationTemplate } from "../../../src/domain/notifications/enums/notification-template.enum"
import { EmailSendNotificationStrategy } from "../../../src/infrastructure/notifications/strategies/email-send-notification.strategy"
import { EmailMetricsService } from "../../../src/infrastructure/metrics/services/email-metrics.service"
import { NotificationContext } from "../../../src/application/notifications/interfaces/context.interface"
import { setupMocks } from "../../mocks/di.mock"

describe("EmailSendNotificationDecorator", () => {
  let mailerService: jest.Mocked<MailerService>
  let configService: jest.Mocked<ConfigService>
  let metrics: EmailMetricsService
  let strategy: EmailSendNotificationStrategy<NotificationContext>
  let decorator: EmailSendNotificationDecorator<NotificationContext>

  beforeEach(async () => {
    const mocks = await setupMocks()
    mailerService = mocks.mailerService
    configService = mocks.configService
    metrics = mocks.emailMetricsService

    strategy = new EmailSendNotificationStrategy<NotificationContext>(
      mailerService,
      configService
    )
    decorator = new EmailSendNotificationDecorator(strategy, metrics)
  })

  it("should call strategy.send and recordEmailSent", async () => {
    await decorator.send(
      ["a@b.c"],
      "subject",
      { foo: "bar" },
      NotificationTemplate.CONFIRMATION
    )
    expect(mailerService.sendMail).toHaveBeenCalled()
    expect(metrics.recordEmailSent).toHaveBeenCalledWith(
      NotificationTemplate.CONFIRMATION
    )
  })

  it("should recordEmailFailed and throw on error", async () => {
    mailerService.sendMail.mockRejectedValue(new Error("SMTP error"))
    await expect(
      decorator.send(
        ["a@b.c"],
        "subject",
        { foo: "bar" },
        NotificationTemplate.CONFIRMATION
      )
    ).rejects.toThrow("Failed to send email")
    expect(metrics.recordEmailFailed).toHaveBeenCalledWith(
      NotificationTemplate.CONFIRMATION
    )
  })
})
