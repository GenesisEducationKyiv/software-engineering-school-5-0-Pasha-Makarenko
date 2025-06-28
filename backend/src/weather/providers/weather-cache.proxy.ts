import { Cache } from "cache-manager"
import { IWeatherProvider } from "../interfaces/weather.provider.interface"
import { WeatherQueryDto } from "../dto/weather-query.dto"
import { WeatherData } from "../interfaces/weather.interface"

export class WeatherCacheProxy implements IWeatherProvider {
  constructor(
    private provider: IWeatherProvider,
    private cacheManager: Cache,
    private readonly ttl: number
  ) {}

  async getWeather(dto: WeatherQueryDto) {
    const cacheKey = `weather:${dto.city}:${dto.days}`
    const cachedResult = await this.cacheManager.get<WeatherData>(cacheKey)

    if (cachedResult) {
      return cachedResult
    }

    const result = await this.provider.getWeather(dto)

    await this.cacheManager.set(cacheKey, result, this.ttl)

    return result
  }
}
