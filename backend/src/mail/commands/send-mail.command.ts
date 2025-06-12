import { SendMailDto } from "../dto/send-mail.dto"

export class SendMailCommand {
  constructor(
    public readonly dto: SendMailDto,
    public readonly from: string
  ) {}
}
