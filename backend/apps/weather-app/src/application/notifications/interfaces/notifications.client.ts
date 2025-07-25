import { ConfirmationNotificationDto } from "../dto/confirmation-notification.dto"
import { Observable } from "rxjs"
import { WeatherNotificationDto } from "../dto/weather-notification.dto"

export const NOTIFICATIONS_CLIENT = "NOTIFICATIONS_CLIENT"

export interface INotificationsClient {
  sendConfirmation(dto: ConfirmationNotificationDto): Observable<void>

  sendWeather(dto: WeatherNotificationDto): Observable<void>
}
