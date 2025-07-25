import { SendConfirmationNotificationHandler } from "../../../src/application/notifications/commands/handlers/send-confirmation-notification.handler"
import { SendConfirmationNotificationCommand } from "../../../src/application/notifications/commands/impl/send-confirmation-notification.command"
import { NotificationTemplate } from "../../../src/domain/notifications/enums/notification-template.enum"
import { confirmationNotificationDtoMock } from "../../mocks/dto/confirmation-notification.dto.mock"
import { ConfirmContextDto } from "../../../src/application/notifications/dto/confirmation-notification.dto"
import { NotificationStrategyType } from "../../../src/application/notifications/interfaces/send-notification.strategy"
import { MailerService } from "@nestjs-modules/mailer"
import { ConfigService } from "@nestjs/config"
import { EmailSendNotificationStrategy } from "../../../src/infrastructure/notifications/strategies/email-send-notification.strategy"
import { setupMocks } from "../../mocks/di.mock"

describe("SendConfirmationNotificationHandler", () => {
  let mailerService: jest.Mocked<MailerService>
  let configService: jest.Mocked<ConfigService>
  let handler: SendConfirmationNotificationHandler
  let strategies: Record<
    NotificationStrategyType,
    EmailSendNotificationStrategy<ConfirmContextDto>
  >

  beforeEach(async () => {
    const mocks = await setupMocks()
    mailerService = mocks.mailerService
    configService = mocks.configService

    strategies = {
      [NotificationStrategyType.EMAIL]:
        new EmailSendNotificationStrategy<ConfirmContextDto>(
          mailerService,
          configService
        )
    }

    handler = new SendConfirmationNotificationHandler(strategies)
  })

  it("should call strategy.send via CircuitBreaker", async () => {
    const command = new SendConfirmationNotificationCommand(
      confirmationNotificationDtoMock
    )
    await handler.execute(command)
    expect(mailerService.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: confirmationNotificationDtoMock.recipients,
        from: configService.get<string>("SMTP_USER"),
        subject: confirmationNotificationDtoMock.subject,
        template: NotificationTemplate.CONFIRMATION,
        context: confirmationNotificationDtoMock.context
      })
    )
  })

  it("should throw NotFoundNotificationStrategyException if no strategy", async () => {
    handler = new SendConfirmationNotificationHandler(
      {} as Record<string, EmailSendNotificationStrategy<ConfirmContextDto>>
    )
    const command = new SendConfirmationNotificationCommand(
      confirmationNotificationDtoMock
    )
    await expect(handler.execute(command)).rejects.toThrow(
      `No notification strategy found for type: ${NotificationStrategyType.EMAIL}`
    )
  })
})
