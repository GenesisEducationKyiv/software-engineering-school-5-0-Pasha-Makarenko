import { WeatherApiSearchProvider } from "./weather-api-search.provider"
import { ConfigService } from "@nestjs/config"
import { HttpService } from "@nestjs/axios"
import { OpenMeteoSearchProvider } from "./open-meteo-search.provider"
import { SearchCacheProxy } from "./search-cache.proxy"
import { Cache } from "cache-manager"
import { SearchLoggerDecorator } from "./search-logger.decorator"
import { SearchProviderHandler } from "./search.provider.handler"
import { setupChain } from "../../shared/utils/setup-chain.util"

export const SEARCH_PROVIDER = "SEARCH_PROVIDER"

export const searchProviderFactory = (
  configService: ConfigService,
  cacheManager: Cache,
  ...providers: SearchProviderHandler[]
) => {
  const chain = setupChain<SearchProviderHandler>(providers)

  return new SearchLoggerDecorator(
    new SearchCacheProxy(
      chain,
      cacheManager,
      configService.get<number>("SEARCH_CACHE_TTL")!
    )
  )
}

export const weatherApiSearchProviderFactory = (
  configService: ConfigService,
  httpService: HttpService
) => {
  const attributes = {
    url: configService.get<string>("WEATHER_API_SEARCH_URL")!,
    key: configService.get<string>("WEATHER_API_SEARCH_KEY")!
  }
  return new WeatherApiSearchProvider(attributes, httpService)
}

export const openMeteoSearchProviderFactory = (
  configService: ConfigService,
  httpService: HttpService
) => {
  const attributes = {
    url: configService.get<string>("OPEN_METEO_SEARCH_URL")!,
    key: configService.get<string>("OPEN_METEO_SEARCH_KEY") || undefined
  }
  return new OpenMeteoSearchProvider(attributes, httpService)
}
