import { WeatherData } from "./weather.interface"
import { WeatherQueryDto } from "../dto/weather-query.dto"

export interface IWeatherProvider {
  getWeather(dto: WeatherQueryDto): Promise<WeatherData>
}
