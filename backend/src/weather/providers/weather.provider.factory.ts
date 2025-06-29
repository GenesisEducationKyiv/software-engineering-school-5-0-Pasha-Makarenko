import { ConfigService } from "@nestjs/config"
import { HttpService } from "@nestjs/axios"
import { Cache } from "cache-manager"
import { ISearchProvider } from "../../search/interfaces/search.provider.interface"
import { WeatherApiWeatherProvider } from "./weather-api-weather.provider"
import { OpenMeteoWeatherProvider } from "./open-meteo-weather.provider"
import { WeatherCacheProxy } from "./weather-cache.proxy"
import { WeatherLoggerDecorator } from "./weather-logger.decorator"
import { WeatherProviderHandler } from "./weather.provider.handler"
import { setupChain } from "../../shared/utils/setup-chain.util"
import { ICacheMetricsService } from "../../metrics/interfaces/cache-metrics.interface"

export const WEATHER_PROVIDER = "WEATHER_PROVIDER"

export const weatherProviderFactory = (
  configService: ConfigService,
  cacheManager: Cache,
  cacheMetricsService: ICacheMetricsService,
  ...providers: WeatherProviderHandler[]
) => {
  const chain = setupChain<WeatherProviderHandler>(providers)

  return new WeatherLoggerDecorator(
    new WeatherCacheProxy(
      chain,
      cacheManager,
      cacheMetricsService,
      configService.get<number>("WEATHER_CACHE_TTL")!
    )
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
