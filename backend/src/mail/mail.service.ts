import { Injectable } from "@nestjs/common"
import { SendMailDto } from "./dto/send-mail.dto"
import { ConfigService } from "@nestjs/config"
import { CommandBus } from "@nestjs/cqrs"
import { SendMailCommand } from "./commands/send-mail.command"

@Injectable()
export class MailService {
  private readonly from: string

  constructor(
    private commandBus: CommandBus,
    private configService: ConfigService
  ) {
    this.from = this.configService.get<string>("SMTP_USER")!
  }

  async sendMail(dto: SendMailDto) {
    return this.commandBus.execute(new SendMailCommand(dto, this.from))
  }
}
