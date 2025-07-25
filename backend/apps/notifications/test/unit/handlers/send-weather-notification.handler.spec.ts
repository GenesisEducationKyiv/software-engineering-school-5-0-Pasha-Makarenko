import { SendWeatherNotificationHandler } from "../../../src/application/notifications/commands/handlers/send-weather-notification.handler"
import { SendWeatherNotificationCommand } from "../../../src/application/notifications/commands/impl/send-weather-notification.command"
import { NotificationTemplate } from "../../../src/domain/notifications/enums/notification-template.enum"
import { weatherNotificationDtoMock } from "../../mocks/dto/weather-notification.dto.mock"
import { WeatherContextDto } from "../../../src/application/notifications/dto/weather-notification.dto"
import { NotificationStrategyType } from "../../../src/application/notifications/interfaces/send-notification.strategy"
import { MailerService } from "@nestjs-modules/mailer"
import { ConfigService } from "@nestjs/config"
import { EmailSendNotificationStrategy } from "../../../src/infrastructure/notifications/strategies/email-send-notification.strategy"
import { setupMocks } from "../../mocks/di.mock"

describe("SendWeatherNotificationHandler", () => {
  let mailerService: jest.Mocked<MailerService>
  let configService: jest.Mocked<ConfigService>
  let handler: SendWeatherNotificationHandler
  let strategies: Record<
    NotificationStrategyType,
    EmailSendNotificationStrategy<WeatherContextDto>
  >

  beforeEach(async () => {
    const mocks = await setupMocks()
    mailerService = mocks.mailerService
    configService = mocks.configService

    strategies = {
      [NotificationStrategyType.EMAIL]:
        new EmailSendNotificationStrategy<WeatherContextDto>(
          mailerService,
          configService
        )
    }
    handler = new SendWeatherNotificationHandler(strategies)
  })

  it("should call strategy.send", async () => {
    const command = new SendWeatherNotificationCommand(
      weatherNotificationDtoMock
    )
    await handler.execute(command)
    expect(mailerService.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: weatherNotificationDtoMock.recipients,
        from: configService.get<string>("SMTP_USER"),
        subject: weatherNotificationDtoMock.subject,
        template: NotificationTemplate.WEATHER,
        context: weatherNotificationDtoMock.context
      })
    )
  })

  it("should throw NotFoundNotificationStrategyException if no strategy", async () => {
    handler = new SendWeatherNotificationHandler(
      {} as Record<string, EmailSendNotificationStrategy<WeatherContextDto>>
    )
    const command = new SendWeatherNotificationCommand(
      weatherNotificationDtoMock
    )
    await expect(handler.execute(command)).rejects.toThrow(
      `No notification strategy found for type: ${NotificationStrategyType.EMAIL}`
    )
  })
})
