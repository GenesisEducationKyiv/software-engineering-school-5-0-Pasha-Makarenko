import { WeatherApiUrlQueryDto } from "../dto/weather-api-url-query.dto"

export class GetSearchUrlQuery {
  constructor(
    public readonly urlDto: WeatherApiUrlQueryDto,
    public readonly search: string
  ) {}
}
