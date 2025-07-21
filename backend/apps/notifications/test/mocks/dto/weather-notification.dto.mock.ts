import { WeatherContextDto } from "../../../src/application/notifications/dto/weather-notification.dto"
import { NotificationStrategyType } from "../../../src/application/notifications/interfaces/send-notification.strategy"
import { WeatherData } from "../../../src/domain/notifications/value-objects/weather-data.value-object"

const weatherDataMock = WeatherData.create(
  "Moscow",
  "Russia",
  "2024-07-19",
  "Cloudy",
  20,
  []
)

export const weatherNotificationDtoMock = {
  recipients: ["a@b.c"],
  subject: "subj",
  type: NotificationStrategyType.EMAIL,
  context: {
    unsubscribeUrl: "https://example.com/unsubscribe/123",
    weather: weatherDataMock
  } as WeatherContextDto
}
