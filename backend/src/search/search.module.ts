import { Module } from "@nestjs/common"
import { SearchController } from "./controllers/search.controller"
import { HttpModule, HttpService } from "@nestjs/axios"
import { GetCitiesHandler } from "./queries/handlers/get-cities.handler"
import { CqrsModule } from "@nestjs/cqrs"
import {
  openMeteoSearchProviderFactory,
  SEARCH_PROVIDER,
  searchProviderFactory,
  weatherApiSearchProviderFactory
} from "./providers/search.provider.factory"
import { ConfigService } from "@nestjs/config"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { WeatherApiSearchProvider } from "./providers/weather-api-search.provider"
import { OpenMeteoSearchProvider } from "./providers/open-meteo-search.provider"
import { CACHE_METRICS_SERVICE } from "../metrics/services/cache-metrics.service"
import { MetricsModule } from "../metrics/metrics.module"

const queryHandlers = [GetCitiesHandler]

@Module({
  controllers: [SearchController],
  imports: [CqrsModule, HttpModule, MetricsModule],
  providers: [
    ...queryHandlers,
    {
      provide: WeatherApiSearchProvider,
      useFactory: weatherApiSearchProviderFactory,
      inject: [ConfigService, HttpService]
    },
    {
      provide: OpenMeteoSearchProvider,
      useFactory: openMeteoSearchProviderFactory,
      inject: [ConfigService, HttpService]
    },
    {
      provide: SEARCH_PROVIDER,
      useFactory: searchProviderFactory,
      inject: [
        ConfigService,
        CACHE_MANAGER,
        CACHE_METRICS_SERVICE,
        WeatherApiSearchProvider,
        OpenMeteoSearchProvider
      ]
    }
  ],
  exports: [...queryHandlers, SEARCH_PROVIDER]
})
export class SearchModule {}
