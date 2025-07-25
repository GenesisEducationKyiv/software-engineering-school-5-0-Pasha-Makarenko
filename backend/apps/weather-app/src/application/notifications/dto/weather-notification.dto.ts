import { NotificationDto } from "./notification.dto"
import { WeatherContextDto } from "../../weather/dto/weather-context.dto"

export class WeatherNotificationDto extends NotificationDto {
  readonly context: WeatherContextDto
}
