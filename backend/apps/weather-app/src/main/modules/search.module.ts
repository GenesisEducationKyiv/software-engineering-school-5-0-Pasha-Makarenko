import { Module } from "@nestjs/common"
import { SearchController } from "../../presentation/search/controllers/search.controller"
import { HttpModule, HttpService } from "@nestjs/axios"
import { GetCitiesHandler } from "../../application/search/queries/handlers/get-cities.handler"
import { CqrsModule } from "@nestjs/cqrs"
import { ConfigService } from "@nestjs/config"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { CACHE_METRICS_SERVICE } from "../../application/metrics/interfaces/cache-metrics.interface"
import { MetricsModule } from "./metrics.module"
import { WeatherApiSearchProvider } from "../../infrastructure/search/services/providers/weather-api-search.provider"
import {
  openMeteoSearchProviderFactory,
  searchProviderFactory,
  weatherApiSearchProviderFactory
} from "../../infrastructure/search/services/providers/search.provider.factory"
import { OpenMeteoSearchProvider } from "../../infrastructure/search/services/providers/open-meteo-search.provider"
import { SEARCH_PROVIDER } from "../../domain/search/providers/search.provider.interface"

const queryHandlers = [GetCitiesHandler]

const providers = [
  {
    provide: WeatherApiSearchProvider,
    useFactory: weatherApiSearchProviderFactory,
    inject: [ConfigService, HttpService]
  },
  {
    provide: OpenMeteoSearchProvider,
    useFactory: openMeteoSearchProviderFactory,
    inject: [ConfigService, HttpService]
  }
]

@Module({
  controllers: [SearchController],
  imports: [CqrsModule, HttpModule, MetricsModule],
  providers: [
    ...queryHandlers,
    ...providers,
    {
      provide: SEARCH_PROVIDER,
      useFactory: searchProviderFactory,
      inject: [
        ConfigService,
        CACHE_MANAGER,
        CACHE_METRICS_SERVICE,
        ...providers.map(provider => provider.provide)
      ]
    }
  ],
  exports: [...queryHandlers, SEARCH_PROVIDER]
})
export class SearchModule {}
