import { ConfigService } from "@nestjs/config"
import { HttpService } from "@nestjs/axios"
import { Cache } from "cache-manager"
import { ISearchProvider } from "../../search/interfaces/search.provider.interface"
import { WeatherApiWeatherProvider } from "./weather-api-weather.provider"
import { OpenMeteoWeatherProvider } from "./open-meteo-weather.provider"
import { WeatherCacheProxy } from "./weather-cache.proxy"
import { WeatherLoggerDecorator } from "./weather-logger.decorator"
import { WeatherProviderHandler } from "./weather.provider.handler"

export const WEATHER_PROVIDER = "WEATHER_PROVIDER"

export const weatherProviderFactory = (
  configService: ConfigService,
  httpService: HttpService,
  searchProvider: ISearchProvider,
  cacheManager: Cache
) => {
  const weatherApiAttributes = {
    url: configService.get<string>("WEATHER_API_WEATHER_URL")!,
    key: configService.get<string>("WEATHER_API_WEATHER_KEY")!
  }
  const openMeteoAttributes = {
    url: configService.get<string>("OPEN_METEO_WEATHER_URL")!,
    key: configService.get<string>("OPEN_METEO_WEATHER_KEY") || undefined
  }

  const current: WeatherProviderHandler = new WeatherApiWeatherProvider(
    weatherApiAttributes,
    httpService
  )
  const next: WeatherProviderHandler = new OpenMeteoWeatherProvider(
    openMeteoAttributes,
    httpService,
    searchProvider
  )
  current.setNext(next)

  return new WeatherLoggerDecorator(
    new WeatherCacheProxy(
      next,
      cacheManager,
      configService.get<number>("WEATHER_CACHE_TTL")!
    )
  )
}
