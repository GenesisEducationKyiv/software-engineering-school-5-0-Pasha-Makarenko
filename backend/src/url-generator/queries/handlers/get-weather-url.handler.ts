import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { GetWeatherUrlQuery } from "../get-weather-url.query"
import { WeatherApiConst } from "../../consts/weather-api.const"

@QueryHandler(GetWeatherUrlQuery)
export class GetWeatherUrlHandler implements IQueryHandler<GetWeatherUrlQuery> {
  async execute(query: GetWeatherUrlQuery) {
    const { urlDto, weatherDto } = query

    return {
      url: urlDto.weatherApiUrl + WeatherApiConst.weather,
      params: {
        key: urlDto.weatherApiKey,
        q: weatherDto.city,
        days: weatherDto.days,
        aqi: "no",
        alerts: "no"
      }
    }
  }
}
