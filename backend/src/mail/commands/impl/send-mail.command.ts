import { SendMailDto } from "../../dto/send-mail.dto"
import { Command } from "@nestjs/cqrs"

export class SendMailCommand extends Command<void> {
  constructor(public readonly dto: SendMailDto) {
    super()
  }
}
