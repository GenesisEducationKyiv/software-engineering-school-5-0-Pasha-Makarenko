import { Cache } from "cache-manager"
import { IWeatherProvider } from "../../../../domain/weather/providers/weather.provider.interface"
import { ICacheMetricsService } from "../../../metrics/interfaces/cache-metrics.interface"
import { WeatherGetting } from "../../../../domain/weather/value-objects/weather-getting.value-object"
import { WeatherData } from "../../../../domain/weather/value-objects/weather-data.value-object"

export class WeatherCacheProxy implements IWeatherProvider {
  constructor(
    private provider: IWeatherProvider,
    private cacheManager: Cache,
    private cacheMetricsService: ICacheMetricsService,
    private readonly ttl: number
  ) {}

  async getWeather(dto: WeatherGetting) {
    const cacheKey = `weather:${dto.city}:${dto.days}`
    const cachedResult = await this.cacheManager.get<WeatherData>(cacheKey)

    if (cachedResult) {
      this.cacheMetricsService.recordCacheHit("weather")
      return cachedResult
    }

    const result = await this.provider.getWeather(dto)

    this.cacheMetricsService.recordCacheMiss("weather")
    await this.cacheManager.set(cacheKey, result, this.ttl)

    return result
  }
}
