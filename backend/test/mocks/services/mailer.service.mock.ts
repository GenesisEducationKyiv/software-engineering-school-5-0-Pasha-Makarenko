import { MailerService } from "@nestjs-modules/mailer"

export const mailerServiceMockFactory = () =>
  ({
    sendMail: jest.fn()
  }) as never as MailerService
