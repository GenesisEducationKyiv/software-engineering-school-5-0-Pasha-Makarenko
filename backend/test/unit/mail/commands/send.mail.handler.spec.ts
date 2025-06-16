import { Test } from "@nestjs/testing"
import { MailerService } from "@nestjs-modules/mailer"
import { ConfigService } from "@nestjs/config"
import { InternalServerErrorException } from "@nestjs/common"
import { SendMailHandler } from "../../../../src/mail/commands/handlers/send.mail.handler"
import { SendMailCommand } from "../../../../src/mail/commands/impl/send-mail.command"
import { mailerServiceMockFactory } from "../../../mocks/services/mailer.service.mock"
import {
  configServiceMockFactory,
  SMTP_USER
} from "../../../mocks/services/config.service.mock"
import {
  sendMailDtoMock1,
  sendMailDtoMock2
} from "../../../mocks/dto/send-mail.dto.mock"

describe("SendMailHandler", () => {
  let handler: SendMailHandler
  let mailerService: MailerService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SendMailHandler,
        {
          provide: MailerService,
          useValue: mailerServiceMockFactory()
        },
        {
          provide: ConfigService,
          useValue: configServiceMockFactory()
        }
      ]
    }).compile()

    handler = moduleRef.get<SendMailHandler>(SendMailHandler)
    mailerService = moduleRef.get<MailerService>(MailerService)
  })

  describe("execute", () => {
    it("should send email with correct parameters", async () => {
      const dto = sendMailDtoMock1
      const command = new SendMailCommand(dto)

      jest.spyOn(mailerService, "sendMail").mockResolvedValue(true)

      await handler.execute(command)

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: dto.emails,
        subject: dto.subject,
        template: dto.template,
        from: SMTP_USER,
        context: dto.context
      })
    })

    it("should throw InternalServerErrorException when mail sending fails", async () => {
      const command = new SendMailCommand(sendMailDtoMock1)

      const errorMessage = "SMTP connection failed"
      jest
        .spyOn(mailerService, "sendMail")
        .mockRejectedValue(new Error(errorMessage))

      await expect(handler.execute(command)).rejects.toThrow(
        InternalServerErrorException
      )
      await expect(handler.execute(command)).rejects.toThrow(errorMessage)
    })

    it("should handle multiple recipients", async () => {
      const command = new SendMailCommand(sendMailDtoMock2)

      jest.spyOn(mailerService, "sendMail").mockResolvedValue(true)

      await handler.execute(command)

      expect(mailerService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: sendMailDtoMock2.emails
        })
      )
    })
  })
})
