import { WeatherApiUrlQueryDto } from "../dto/weather-api-url-query.dto"
import { WeatherQueryDto } from "../../weather/dto/weather-query.dto"

export class GetWeatherUrlQuery {
  constructor(
    public readonly urlDto: WeatherApiUrlQueryDto,
    public readonly weatherDto: WeatherQueryDto
  ) {}
}
