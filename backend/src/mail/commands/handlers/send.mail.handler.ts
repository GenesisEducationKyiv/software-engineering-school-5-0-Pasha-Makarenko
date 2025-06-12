import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { SendMailCommand } from "../send-mail.command"
import { MailerService } from "@nestjs-modules/mailer"
import { InternalServerErrorException } from "@nestjs/common"

@CommandHandler(SendMailCommand)
export class SendMailHandler implements ICommandHandler<SendMailCommand> {
  constructor(private mailerService: MailerService) {}

  async execute(command: SendMailCommand) {
    const { dto, from } = command

    try {
      await this.mailerService.sendMail({
        to: dto.emails,
        from: from,
        subject: dto.subject,
        template: dto.template,
        context: dto.context
      })
    } catch (error) {
      throw new InternalServerErrorException(
        error?.message || "Failed to send email"
      )
    }
  }
}
