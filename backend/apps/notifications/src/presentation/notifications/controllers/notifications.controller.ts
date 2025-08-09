import { Controller, Logger } from "@nestjs/common"
import { CommandBus } from "@nestjs/cqrs"
import { SendConfirmationNotificationCommand } from "../../../application/notifications/commands/impl/send-confirmation-notification.command"
import { EventPattern, Payload } from "@nestjs/microservices"
import { ConfirmationNotificationDto } from "../../../application/notifications/dto/confirmation-notification.dto"
import { SendWeatherNotificationCommand } from "../../../application/notifications/commands/impl/send-weather-notification.command"
import { WeatherNotificationDto } from "../../../application/notifications/dto/weather-notification.dto"

@Controller()
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name)

  constructor(private commandBus: CommandBus) {}

  @EventPattern("notifications.sendConfirmation")
  async sendConfirmationNotification(
    @Payload() dto: ConfirmationNotificationDto
  ) {
    this.logger.log({
      operation: "sendConfirmationNotification",
      params: dto,
      message: "Sending confirmation notification"
    })
    await this.commandBus.execute(new SendConfirmationNotificationCommand(dto))
    this.logger.log({
      operation: "sendConfirmationNotification",
      params: dto,
      message: "Confirmation notification sent successfully"
    })
  }

  @EventPattern("notifications.sendWeather")
  async sendWeatherNotification(@Payload() dto: WeatherNotificationDto) {
    this.logger.log({
      operation: "sendWeatherNotification",
      params: dto,
      message: "Sending weather notification"
    })
    await this.commandBus.execute(new SendWeatherNotificationCommand(dto))
    this.logger.log({
      operation: "sendWeatherNotification",
      params: dto,
      message: "Weather notification sent successfully"
    })
  }
}
