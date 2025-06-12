import { Module } from "@nestjs/common"
import { MailService } from "./mail.service"
import { MailerModule } from "@nestjs-modules/mailer"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { getMailConfig } from "../config/mail.config"
import { SendMailHandler } from "./commands/handlers/send.mail.handler"
import { CqrsModule } from "@nestjs/cqrs"

const commandHandlers = [SendMailHandler]

@Module({
  providers: [MailService, ...commandHandlers],
  imports: [
    CqrsModule,
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getMailConfig,
      inject: [ConfigService]
    })
  ],
  exports: [MailService, ...commandHandlers]
})
export class MailModule {}
