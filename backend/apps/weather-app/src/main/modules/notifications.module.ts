import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { SendConfirmationNotificationHandler } from "../../application/notifications/commands/handlers/send-confirmation-notification.handler"
import { SendWeatherNotificationHandler } from "../../application/notifications/commands/handlers/send-weather-notification.handler"
import { WEATHER_CONTEXT_MAPPER } from "../../application/notifications/interfaces/weather-context.interface"
import { WeatherContextMapper } from "../../infrastructure/notifications/mapper/weather-context.mapper"
import { ClientsModule, Transport } from "@nestjs/microservices"
import { NOTIFICATIONS_CLIENT } from "../../application/notifications/interfaces/notifications.client"
import { ConfigService } from "@nestjs/config"
import { getRabbitMqUrls } from "../config/rabbitmq.config"

const commandHandlers = [
  SendConfirmationNotificationHandler,
  SendWeatherNotificationHandler
]

@Module({
  providers: [
    {
      provide: WEATHER_CONTEXT_MAPPER,
      useClass: WeatherContextMapper
    },
    ...commandHandlers
  ],
  imports: [
    CqrsModule,
    ClientsModule.registerAsync([
      {
        name: NOTIFICATIONS_CLIENT,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: getRabbitMqUrls(configService),
            queue: "notifications",
            queueOptions: {
              durable: true
            }
          }
        }),
        inject: [ConfigService]
      }
    ])
  ],
  exports: commandHandlers
})
export class NotificationsModule {}
