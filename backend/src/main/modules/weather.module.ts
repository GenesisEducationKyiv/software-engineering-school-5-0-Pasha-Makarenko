import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { HttpModule, HttpService } from "@nestjs/axios"
import { WeatherController } from "../../presentation/weather/controllers/weather.controller"
import { GetWeatherHandler } from "../../application/weather/queries/handlers/get-weather.handler"
import {
  openMeteoWeatherProviderFactory,
  weatherApiWeatherProviderFactory,
  weatherProviderFactory
} from "../../infrastructure/weather/services/providers/weather.provider.factory"
import { ConfigService } from "@nestjs/config"
import { SearchModule } from "./search.module"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { WeatherApiWeatherProvider } from "../../infrastructure/weather/services/providers/weather-api-weather.provider"
import { OpenMeteoWeatherProvider } from "../../infrastructure/weather/services/providers/open-meteo-weather.provider"
import { CACHE_METRICS_SERVICE } from "../../infrastructure/metrics/services/cache-metrics.service"
import { MetricsModule } from "./metrics.module"
import { WEATHER_PROVIDER } from "../../domain/weather/providers/weather.provider.interface"
import { SEARCH_PROVIDER } from "../../domain/search/providers/search.provider.interface"

const queryHandlers = [GetWeatherHandler]

const providers = [
  {
    provide: WeatherApiWeatherProvider,
    useFactory: weatherApiWeatherProviderFactory,
    inject: [ConfigService, HttpService]
  },
  {
    provide: OpenMeteoWeatherProvider,
    useFactory: openMeteoWeatherProviderFactory,
    inject: [ConfigService, HttpService, SEARCH_PROVIDER]
  }
]

@Module({
  controllers: [WeatherController],
  imports: [CqrsModule, HttpModule, MetricsModule, SearchModule],
  providers: [
    ...queryHandlers,
    ...providers,
    {
      provide: WEATHER_PROVIDER,
      useFactory: weatherProviderFactory,
      inject: [
        ConfigService,
        CACHE_MANAGER,
        CACHE_METRICS_SERVICE,
        ...providers.map(provider => provider.provide)
      ]
    }
  ],
  exports: queryHandlers
})
export class WeatherModule {}
