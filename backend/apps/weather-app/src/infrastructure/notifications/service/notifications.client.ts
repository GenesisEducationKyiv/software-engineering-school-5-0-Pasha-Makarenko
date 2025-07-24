import { INotificationsClient } from "../../../application/notifications/interfaces/notifications.client"
import { ClientProxy } from "@nestjs/microservices"
import { ConfirmationNotificationDto } from "../../../application/notifications/dto/confirmation-notification.dto"
import { WeatherNotificationDto } from "../../../application/notifications/dto/weather-notification.dto"

export class NotificationsClient implements INotificationsClient {
  constructor(private client: ClientProxy) {}

  sendConfirmation(dto: ConfirmationNotificationDto) {
    return this.client.emit("notifications.sendConfirmation", dto)
  }

  sendWeather(dto: WeatherNotificationDto) {
    return this.client.emit("notifications.sendWeather", dto)
  }
}
