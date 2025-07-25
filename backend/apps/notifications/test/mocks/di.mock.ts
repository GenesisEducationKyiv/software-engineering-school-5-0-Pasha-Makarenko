import { Test } from "@nestjs/testing"
import { MailerService } from "@nestjs-modules/mailer"
import { mailerServiceMockFactory } from "./services/mailer.service.mock"
import { ConfigService } from "@nestjs/config"
import { configServiceMockFactory } from "./services/config.service.mock"
import { EmailMetricsService } from "../../src/infrastructure/metrics/services/email-metrics.service"
import { emailMetricsServiceMockFactory } from "./services/metrics.service.mock"

export const setupMocks = async () => {
  const moduleRef = await Test.createTestingModule({
    providers: [
      {
        provide: MailerService,
        useValue: mailerServiceMockFactory()
      },
      {
        provide: ConfigService,
        useValue: configServiceMockFactory()
      },
      {
        provide: EmailMetricsService,
        useValue: emailMetricsServiceMockFactory()
      }
    ]
  }).compile()

  return {
    mailerService: moduleRef.get<MailerService>(
      MailerService
    ) as jest.Mocked<MailerService>,
    configService: moduleRef.get<ConfigService>(
      ConfigService
    ) as jest.Mocked<ConfigService>,
    emailMetricsService: moduleRef.get<EmailMetricsService>(
      EmailMetricsService
    ) as jest.Mocked<EmailMetricsService>
  }
}
