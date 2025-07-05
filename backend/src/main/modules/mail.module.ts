import { Module } from "@nestjs/common"
import { MailerModule } from "@nestjs-modules/mailer"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { getMailConfig } from "../config/mail.config"
import { SendMailHandler } from "../../application/mail/commands/handlers/send.mail.handler"
import { CqrsModule } from "@nestjs/cqrs"

const commandHandlers = [SendMailHandler]

@Module({
  providers: commandHandlers,
  imports: [
    CqrsModule,
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getMailConfig,
      inject: [ConfigService]
    })
  ],
  exports: commandHandlers
})
export class MailModule {}
