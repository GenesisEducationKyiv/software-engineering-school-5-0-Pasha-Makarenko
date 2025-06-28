import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { SendMailCommand } from "../impl/send-mail.command"
import { MailerService } from "@nestjs-modules/mailer"
import { ConfigService } from "@nestjs/config"
import { MailSendingFailedException } from "../../exceptions/mail-sending-failed.exception"

@CommandHandler(SendMailCommand)
export class SendMailHandler implements ICommandHandler<SendMailCommand> {
  private readonly from: string

  constructor(
    private mailerService: MailerService,
    private configService: ConfigService
  ) {
    this.from = this.configService.get<string>("SMTP_USER")!
  }

  async execute(command: SendMailCommand) {
    const { dto } = command

    try {
      await this.mailerService.sendMail({
        to: dto.emails,
        from: this.from,
        subject: dto.subject,
        template: dto.template,
        context: dto.context
      })
    } catch (error) {
      throw new MailSendingFailedException(
        error?.message || "Failed to send email",
        error
      )
    }
  }
}
