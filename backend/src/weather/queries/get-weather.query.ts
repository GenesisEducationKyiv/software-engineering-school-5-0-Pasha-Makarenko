import { WeatherQueryDto } from "../dto/weather-query.dto"

export class GetWeatherQuery {
  constructor(public readonly dto: WeatherQueryDto) {}
}
