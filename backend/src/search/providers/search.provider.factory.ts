import { WeatherApiSearchProvider } from "./weather-api-search.provider"
import { ConfigService } from "@nestjs/config"
import { HttpService } from "@nestjs/axios"
import { OpenMeteoSearchProvider } from "./open-meteo-search.provider"
import { SearchCacheProxy } from "./search-cache.proxy"
import { Cache } from "cache-manager"
import { SearchLoggerDecorator } from "./search-logger.decorator"
import { SearchProviderHandler } from "./search.provider.handler"

export const SEARCH_PROVIDER = "SEARCH_PROVIDER"

export const searchProviderFactory = (
  configService: ConfigService,
  httpService: HttpService,
  cacheManager: Cache
) => {
  const weatherApiAttributes = {
    url: configService.get<string>("WEATHER_API_SEARCH_URL")!,
    key: configService.get<string>("WEATHER_API_SEARCH_KEY")!
  }
  const openMeteoAttributes = {
    url: configService.get<string>("OPEN_METEO_SEARCH_URL")!,
    key: configService.get<string>("OPEN_METEO_SEARCH_KEY") || undefined
  }

  const current: SearchProviderHandler = new WeatherApiSearchProvider(
    weatherApiAttributes,
    httpService
  )
  const next: SearchProviderHandler = new OpenMeteoSearchProvider(
    openMeteoAttributes,
    httpService
  )
  current.setNext(next)

  return new SearchLoggerDecorator(
    new SearchCacheProxy(
      next,
      cacheManager,
      configService.get<number>("SEARCH_CACHE_TTL")!
    )
  )
}
