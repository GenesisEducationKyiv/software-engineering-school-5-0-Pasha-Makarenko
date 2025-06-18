import { SendMailDto } from "../../../src/mail/dto/send-mail.dto"

export const sendMailDtoWithOneRecipientMock = {
  emails: ["test@example.com"],
  subject: "Test Subject",
  template: "test-template",
  context: {}
} as SendMailDto

export const sendMailDtoWithManyRecipientsMock = {
  emails: ["test1@example.com", "test2@example.com"],
  subject: "Test Subject",
  template: "test-template",
  context: {}
} as SendMailDto
