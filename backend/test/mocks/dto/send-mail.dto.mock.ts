import { SendMailDto } from "../../../src/mail/dto/send-mail.dto"

export const sendMailDtoMock1 = {
  emails: ["test@example.com"],
  subject: "Test Subject",
  template: "test-template",
  context: {}
} as SendMailDto

export const sendMailDtoMock2 = {
  emails: ["test1@example.com", "test2@example.com"],
  subject: "Test Subject",
  template: "test-template",
  context: {}
} as SendMailDto
