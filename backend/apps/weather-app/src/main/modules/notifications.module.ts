import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { SendConfirmationNotificationHandler } from "../../application/notifications/commands/handlers/send-confirmation-notification.handler"
import { SendWeatherNotificationHandler } from "../../application/notifications/commands/handlers/send-weather-notification.handler"
import { WEATHER_CONTEXT_MAPPER } from "../../application/notifications/interfaces/weather-context.interface"
import { WeatherContextMapper } from "../../infrastructure/notifications/mapper/weather-context.mapper"
import { ClientProxyFactory, Transport } from "@nestjs/microservices"
import { NOTIFICATIONS_CLIENT } from "../../application/notifications/interfaces/notifications.client"
import { ConfigService } from "@nestjs/config"
import { getRabbitMqUrls } from "../config/rabbitmq.config"
import { NotificationsClient } from "../../infrastructure/notifications/service/notifications.client"

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
    {
      provide: NOTIFICATIONS_CLIENT,
      useFactory: (configService: ConfigService) =>
        new NotificationsClient(
          ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
              urls: getRabbitMqUrls(configService),
              queue: "notifications",
              queueOptions: {
                durable: true
              }
            }
          })
        ),
      inject: [ConfigService]
    },
    ...commandHandlers
  ],
  imports: [CqrsModule],
  exports: [...commandHandlers, NOTIFICATIONS_CLIENT, WEATHER_CONTEXT_MAPPER]
})
export class NotificationsModule {}
