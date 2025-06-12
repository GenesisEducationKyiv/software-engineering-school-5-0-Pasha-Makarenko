import { BadRequestException, Inject, Injectable } from "@nestjs/common"
import { WeatherQueryDto } from "./dto/weather-query.dto"
import { ConfigService } from "@nestjs/config"
import { WeatherData } from "./weather.interface"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Cache } from "cache-manager"
import { QueryBus } from "@nestjs/cqrs"
import { GetWeatherQuery } from "./queries/get-weather.query"

@Injectable()
export class WeatherService {
  constructor(
    private configService: ConfigService,
    private queryBus: QueryBus,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async weather(dto: WeatherQueryDto) {
    const cacheKey = `weather_${dto.city}_${dto.days}`
    const cachedData = await this.cacheManager.get<WeatherData>(cacheKey)

    if (cachedData) {
      return cachedData
    }

    const weatherData = await this.queryBus.execute(new GetWeatherQuery(dto))

    if (!weatherData) {
      throw new BadRequestException(
        `No weather data found for city: ${dto.city}`
      )
    }

    const ttl = Number(this.configService.get<number>("WEATHER_CACHE_TTL"))
    await this.cacheManager.set(cacheKey, weatherData, ttl)

    return weatherData
  }
}
