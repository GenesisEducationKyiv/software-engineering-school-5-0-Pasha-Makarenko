import { Controller } from "@nestjs/common"
import { CommandBus } from "@nestjs/cqrs"
import { SendConfirmationNotificationCommand } from "../../../application/notifications/commands/impl/send-confirmation-notification.command"
import { MessagePattern, Payload } from "@nestjs/microservices"
import { ConfirmationNotificationDto } from "../../../application/notifications/dto/confirmation-notification.dto"
import { SendWeatherNotificationCommand } from "../../../application/notifications/commands/impl/send-weather-notification.command"
import { WeatherNotificationDto } from "../../../application/notifications/dto/weather-notification.dto"

@Controller()
export class NotificationsController {
  constructor(private commandBus: CommandBus) {}

  @MessagePattern("notifications.sendConfirmation")
  async sendConfirmationNotification(
    @Payload() dto: ConfirmationNotificationDto
  ) {
    await this.commandBus.execute(new SendConfirmationNotificationCommand(dto))
  }

  @MessagePattern("notifications.sendWeather")
  async sendWeatherNotification(@Payload() dto: WeatherNotificationDto) {
    await this.commandBus.execute(new SendWeatherNotificationCommand(dto))
  }
}
