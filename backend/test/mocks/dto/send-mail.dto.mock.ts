import { MailTemplate, SendMailDto } from "../../../src/mail/dto/send-mail.dto"
import { weatherDataMock } from "../data/weather.mock"

export const sendMailDtoWithOneRecipientMock: SendMailDto = {
  emails: ["test@example.com"],
  subject: "Test Subject",
  template: MailTemplate.CONFIRM,
  context: { confirmUrl: `${process.env.CLIENT_URL}/confirm` }
}

export const sendMailDtoWithManyRecipientsMock: SendMailDto = {
  emails: ["test1@example.com", "test2@example.com"],
  subject: "Test Subject",
  template: MailTemplate.WEATHER,
  context: {
    unsubscribeUrl: `${process.env.CLIENT_URL}/unsubscribe`,
    weather: weatherDataMock
  }
}
