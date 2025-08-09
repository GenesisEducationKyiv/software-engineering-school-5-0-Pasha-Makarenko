import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { Inject, Logger } from "@nestjs/common"
import { GetWeatherQuery } from "../impl/get-weather.query"
import {
  IWeatherProvider,
  WEATHER_PROVIDER
} from "../../../../domain/weather/providers/weather.provider.interface"
import { WeatherGetting } from "../../../../domain/weather/value-objects/weather-getting.value-object"
import {
  IWeatherMetricsService,
  WEATHER_METRICS_SERVICE
} from "../../../metrics/interfaces/weather-metrics.interface"

@QueryHandler(GetWeatherQuery)
export class GetWeatherHandler implements IQueryHandler<GetWeatherQuery> {
  private readonly logger = new Logger(GetWeatherHandler.name)

  constructor(
    @Inject(WEATHER_PROVIDER)
    private weatherProvider: IWeatherProvider,
    @Inject(WEATHER_METRICS_SERVICE)
    private weatherMetricsService: IWeatherMetricsService
  ) {}

  async execute(query: GetWeatherQuery) {
    const { dto } = query
    const startTime = Date.now()

    this.logger.log({
      operation: "getWeather",
      params: dto,
      message: "Fetching weather data"
    })
    this.weatherMetricsService.startWeatherRequest(dto.lat, dto.lon)

    try {
      const result = await this.weatherProvider.getWeather(
        WeatherGetting.create(dto.city, dto.lat, dto.lon, dto.days)
      )

      this.weatherMetricsService.recordWeatherRequest(
        dto.lat,
        dto.lon,
        Date.now() - startTime
      )
      this.logger.log({
        operation: "getWeather",
        params: dto,
        message: "Weather data fetched successfully"
      })

      return result
    } catch (error) {
      this.weatherMetricsService.recordWeatherRequestError(dto.lat, dto.lon)
      throw error
    } finally {
      this.weatherMetricsService.endWeatherRequest(dto.lat, dto.lon)
    }
  }
}
