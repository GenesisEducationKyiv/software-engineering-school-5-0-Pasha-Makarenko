import { WeatherData } from "../value-objects/weather-data.value-object"
import { WeatherGetting } from "../value-objects/weather-getting.value-object"

export const WEATHER_PROVIDER = "WEATHER_PROVIDER"

export interface IWeatherProvider {
  getWeather(dto: WeatherGetting): Promise<WeatherData>
}
