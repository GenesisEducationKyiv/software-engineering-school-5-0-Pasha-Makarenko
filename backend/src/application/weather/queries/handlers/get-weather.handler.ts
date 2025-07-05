import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { Inject } from "@nestjs/common"
import { GetWeatherQuery } from "../impl/get-weather.query"
import {
  IWeatherProvider,
  WEATHER_PROVIDER
} from "../../../../domain/weather/providers/weather.provider.interface"
import { WeatherGetting } from "../../../../domain/weather/value-objects/weather-getting.value-object"

@QueryHandler(GetWeatherQuery)
export class GetWeatherHandler implements IQueryHandler<GetWeatherQuery> {
  constructor(
    @Inject(WEATHER_PROVIDER)
    private weatherProvider: IWeatherProvider
  ) {}

  async execute(query: GetWeatherQuery) {
    const { dto } = query

    return await this.weatherProvider.getWeather(
      WeatherGetting.create(dto.city, dto.lat, dto.lon, dto.days)
    )
  }
}
