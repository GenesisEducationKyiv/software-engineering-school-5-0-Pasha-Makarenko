import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { Inject, Logger } from "@nestjs/common"
import { GetWeatherQuery } from "../impl/get-weather.query"
import {
  IWeatherProvider,
  WEATHER_PROVIDER
} from "../../../../domain/weather/providers/weather.provider.interface"
import { WeatherGetting } from "../../../../domain/weather/value-objects/weather-getting.value-object"

@QueryHandler(GetWeatherQuery)
export class GetWeatherHandler implements IQueryHandler<GetWeatherQuery> {
  private readonly logger = new Logger(GetWeatherHandler.name)

  constructor(
    @Inject(WEATHER_PROVIDER)
    private weatherProvider: IWeatherProvider
  ) {}

  async execute(query: GetWeatherQuery) {
    const { dto } = query
    this.logger.log({
      operation: "getWeather",
      params: dto,
      message: "Fetching weather data"
    })
    const result = await this.weatherProvider.getWeather(
      WeatherGetting.create(dto.city, dto.lat, dto.lon, dto.days)
    )
    this.logger.log({
      operation: "getWeather",
      params: dto,
      message: "Weather data fetched successfully"
    })
    return result
  }
}
