import { Cache } from "cache-manager"
import { IWeatherProvider } from "../interfaces/weather.provider.interface"
import { WeatherQueryDto } from "../dto/weather-query.dto"
import { WeatherData } from "../interfaces/weather.interface"
import { ICacheMetricsService } from "../../metrics/interfaces/cache-metrics.interface"

export class WeatherCacheProxy implements IWeatherProvider {
  constructor(
    private provider: IWeatherProvider,
    private cacheManager: Cache,
    private cacheMetricsService: ICacheMetricsService,
    private readonly ttl: number
  ) {}

  async getWeather(dto: WeatherQueryDto) {
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
