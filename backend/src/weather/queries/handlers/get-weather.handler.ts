import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { GetWeatherQuery } from "../impl/get-weather.query"
import { HttpService } from "@nestjs/axios"
import { BadRequestException, Inject } from "@nestjs/common"
import { lastValueFrom } from "rxjs"
import { WeatherData } from "../../interfaces/weather.interface"
import { WeatherUrlGeneratorService } from "../../../url-generator/services/weather-url-generator.service"
import { Cacheable } from "../../../shared/decorators/cacheable.decorator"
import { ConfigService } from "@nestjs/config"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Cache } from "cache-manager"

@QueryHandler(GetWeatherQuery)
export class GetWeatherHandler implements IQueryHandler<GetWeatherQuery> {
  constructor(
    private weatherUrlGeneratorService: WeatherUrlGeneratorService,
    private httpService: HttpService,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @Cacheable({
    key: (query: GetWeatherQuery) =>
      `weather_${query.dto.city}_${query.dto.days}`,
    ttl: configService => configService.get<number>("WEATHER_CACHE_TTL")
  })
  async execute(query: GetWeatherQuery) {
    const { dto } = query
    const { url, params } = this.weatherUrlGeneratorService.weatherUrl(dto)

    try {
      const response = await lastValueFrom(
        this.httpService.get<WeatherData>(url, { params })
      )

      return response.data
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
