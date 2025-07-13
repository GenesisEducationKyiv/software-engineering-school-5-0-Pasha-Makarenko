import { Command } from "@nestjs/cqrs"
import { WeatherNotificationDto } from "../../dto/weather-notification.dto"

export class SendWeatherNotificationCommand extends Command<void> {
  constructor(public readonly dto: WeatherNotificationDto) {
    super()
  }
}
