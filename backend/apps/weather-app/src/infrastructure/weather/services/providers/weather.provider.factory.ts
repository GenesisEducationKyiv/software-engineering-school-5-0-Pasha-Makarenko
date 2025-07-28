import { ConfigService } from "@nestjs/config"
import { HttpService } from "@nestjs/axios"
import { Cache } from "cache-manager"
import { ISearchProvider } from "../../../../domain/search/providers/search.provider.interface"
import { WeatherApiWeatherProvider } from "./weather-api-weather.provider"
import { OpenMeteoWeatherProvider } from "./open-meteo-weather.provider"
import { WeatherCacheProxy } from "../cache/weather-cache.proxy"
import { WeatherProviderHandler } from "./weather.provider.handler"
import { ICacheMetricsService } from "../../../metrics/interfaces/cache-metrics.interface"
import { setupChain } from "../../../common/utils/setup-chain.util"

export const weatherProviderFactory = (
  configService: ConfigService,
  cacheManager: Cache,
  cacheMetricsService: ICacheMetricsService,
  ...providers: WeatherProviderHandler[]
) => {
  const chain = setupChain<WeatherProviderHandler>(providers)

  return new WeatherCacheProxy(
    chain,
    cacheManager,
    cacheMetricsService,
    configService.get<number>("WEATHER_CACHE_TTL")!
  )
}

export const weatherApiWeatherProviderFactory = (
  configService: ConfigService,
  httpService: HttpService
) => {
  return new WeatherApiWeatherProvider(
    {
      url: configService.get<string>("WEATHER_API_WEATHER_URL")!,
      key: configService.get<string>("WEATHER_API_WEATHER_KEY")!
    },
    httpService
  )
}

export const openMeteoWeatherProviderFactory = (
  configService: ConfigService,
  httpService: HttpService,
  searchProvider: ISearchProvider
) => {
  return new OpenMeteoWeatherProvider(
    {
      url: configService.get<string>("OPEN_METEO_WEATHER_URL")!,
      key: configService.get<string>("OPEN_METEO_WEATHER_KEY") || undefined
    },
    httpService,
    searchProvider
  )
}
