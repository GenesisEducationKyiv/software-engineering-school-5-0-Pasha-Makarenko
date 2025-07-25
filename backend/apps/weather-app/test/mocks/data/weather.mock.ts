import {
  WeatherData,
  WeatherDay,
  WeatherHour,
  WeatherLocation
} from "../../../src/domain/weather/value-objects/weather-data.value-object"

export const weatherDataMock = WeatherData.create(
  WeatherLocation.create("Test City", "Test Country", 0, 0),
  [
    WeatherDay.create("2023-01-01", 10, 20, 15, "Sunny", "test-icon.png", [
      WeatherHour.create("2023-01-01 00:00", 10, 5, 60, "test-icon.png"),
      WeatherHour.create("2023-01-01 01:00", 11, 6, 61, "test-icon.png")
    ]),
    WeatherDay.create("2023-01-02", 12, 22, 17, "Cloudy", "cloudy-icon.png", [])
  ]
)
