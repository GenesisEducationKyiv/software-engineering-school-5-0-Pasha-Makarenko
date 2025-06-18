import { Test } from "@nestjs/testing"
import { MailerService } from "@nestjs-modules/mailer"
import { InternalServerErrorException } from "@nestjs/common"
import { SendMailHandler } from "../../../../src/mail/commands/handlers/send.mail.handler"
import { SendMailCommand } from "../../../../src/mail/commands/impl/send-mail.command"
import {
  sendMailDtoWithManyRecipientsMock,
  sendMailDtoWithOneRecipientMock
} from "../../../mocks/dto/send-mail.dto.mock"
import { mailerServiceMockFactory } from "../../../mocks/services/mailer.service.mock"
import { ConfigService } from "@nestjs/config"
import { configServiceMockFactory } from "../../../mocks/services/config.service.mock"

describe("SendMailHandler", () => {
  let handler: SendMailHandler
  let mailerService: MailerService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SendMailHandler,
        {
          provide: ConfigService,
          useValue: configServiceMockFactory()
        },
        {
          provide: MailerService,
          useValue: mailerServiceMockFactory()
        }
      ]
    }).compile()

    handler = moduleRef.get<SendMailHandler>(SendMailHandler)
    mailerService = moduleRef.get<MailerService>(MailerService)
  })

  it("should send email with correct parameters", async () => {
    const dto = sendMailDtoWithOneRecipientMock
    const command = new SendMailCommand(dto)

    await handler.execute(command)

    expect(mailerService.sendMail).toHaveBeenCalledWith({
      to: dto.emails,
      from: process.env["SMTP_USER"],
      subject: dto.subject,
      template: dto.template,
      context: dto.context
    })
  })

  it("should throw when mail sending fails", async () => {
    const command = new SendMailCommand(sendMailDtoWithOneRecipientMock)
    const errorMessage = "SMTP error"

    jest
      .spyOn(mailerService, "sendMail")
      .mockRejectedValue(new Error(errorMessage))

    await expect(handler.execute(command)).rejects.toThrow(
      InternalServerErrorException
    )
    await expect(handler.execute(command)).rejects.toThrow(errorMessage)
  })

  it("should handle multiple recipients", async () => {
    const command = new SendMailCommand(sendMailDtoWithManyRecipientsMock)

    await handler.execute(command)

    expect(mailerService.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: sendMailDtoWithManyRecipientsMock.emails
      })
    )
  })
})
