import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { MetricsModule } from "./modules/metrics.module"
import { LoggerModule } from "nestjs-pino"
import { config } from "../../../weather-app/src/main/config/config"
import { getPinoConfig } from "./config/logger.config"
import {
  NOTIFICATION_STRATEGY,
  NotificationStrategyType,
  SendNotificationStrategy
} from "../application/notifications/interfaces/send-notification.strategy"
import { SendConfirmationNotificationHandler } from "../application/notifications/commands/handlers/send-confirmation-notification.handler"
import { SendWeatherNotificationHandler } from "../application/notifications/commands/handlers/send-weather-notification.handler"
import { WeatherContextDto } from "../application/notifications/dto/weather-notification.dto"
import {
  EMAIL_SEND_NOTIFICATION_STRATEGY,
  emailSendNotificationFactory
} from "../infrastructure/notifications/factories/email-send-notification.factory"
import { MailerModule, MailerService } from "@nestjs-modules/mailer"
import { EMAIL_METRICS_SERVICE } from "../infrastructure/metrics/services/email-metrics.service"
import { NotificationsController } from "../presentation/notifications/controllers/notifications.controller"
import { getMailConfig } from "./config/mail.config"
import { CqrsModule } from "@nestjs/cqrs"

const notificationStrategies = [
  {
    provide: EMAIL_SEND_NOTIFICATION_STRATEGY,
    useFactory: emailSendNotificationFactory,
    inject: [MailerService, ConfigService, EMAIL_METRICS_SERVICE]
  },
  {
    provide: NOTIFICATION_STRATEGY,
    useFactory: (
      emailStrategy: SendNotificationStrategy<WeatherContextDto>
    ) => ({
      [NotificationStrategyType.EMAIL]: emailStrategy
    }),
    inject: [EMAIL_SEND_NOTIFICATION_STRATEGY]
  }
]

const commands = [
  SendConfirmationNotificationHandler,
  SendWeatherNotificationHandler
]

@Module({
  imports: [
    ConfigModule.forRoot(config),
    CqrsModule,
    MetricsModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getMailConfig,
      inject: [ConfigService]
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getPinoConfig,
      inject: [ConfigService]
    })
  ],
  providers: [...notificationStrategies, ...commands],
  controllers: [NotificationsController],
  exports: [ConfigModule]
})
export class NotificationsModule {}
