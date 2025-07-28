import { Cache } from "cache-manager"
import {
  IWeatherProvider,
  WEATHER_PROVIDER
} from "../../../../domain/weather/providers/weather.provider.interface"
import { ICacheMetricsService } from "../../../metrics/interfaces/cache-metrics.interface"
import { WeatherGetting } from "../../../../domain/weather/value-objects/weather-getting.value-object"
import { WeatherData } from "../../../../domain/weather/value-objects/weather-data.value-object"
import { Logger } from "@nestjs/common"

export class WeatherCacheProxy implements IWeatherProvider {
  private readonly logger = new Logger(WEATHER_PROVIDER)

  constructor(
    private provider: IWeatherProvider,
    private cacheManager: Cache,
    private cacheMetricsService: ICacheMetricsService,
    private readonly ttl: number
  ) {}

  async getWeather(dto: WeatherGetting) {
    this.logger.log({
      operation: "getWeather",
      params: dto,
      message: "Fetching weather data"
    })

    const cacheKey = `weather:${dto.city}:${dto.days}`
    const cachedResult = await this.cacheManager.get<WeatherData>(cacheKey)

    if (cachedResult) {
      this.logger.log({
        operation: "getWeather",
        params: dto,
        message: "Returning cached weather data"
      })
      this.cacheMetricsService.recordCacheHit("weather")
      return cachedResult
    }

    const result = await this.provider.getWeather(dto)

    this.logger.log({
      operation: "getWeather",
      params: dto,
      message: "Weather data fetched successfully from provider"
    })
    this.cacheMetricsService.recordCacheMiss("weather")
    await this.cacheManager.set(cacheKey, result, this.ttl)

    return result
  }
}
