import { WeatherData } from "../../../domain/weather/value-objects/weather-data.value-object"
import { WeatherContext } from "../../../domain/notifications/value-objects/weather-context.value-object"

export const WEATHER_CONTEXT_MAPPER = "WEATHER_CONTEXT_MAPPER"

export interface IWeatherContextMapper {
  map(data: WeatherData): WeatherContext
}
