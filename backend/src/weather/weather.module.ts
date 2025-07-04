import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { HttpModule, HttpService } from "@nestjs/axios"
import { WeatherController } from "./controllers/weather.controller"
import { GetWeatherHandler } from "./queries/handlers/get-weather.handler"
import {
  openMeteoWeatherProviderFactory,
  WEATHER_PROVIDER,
  weatherApiWeatherProviderFactory,
  weatherProviderFactory
} from "./providers/weather.provider.factory"
import { SEARCH_PROVIDER } from "../search/providers/search.provider.factory"
import { ConfigService } from "@nestjs/config"
import { SearchModule } from "../search/search.module"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { WeatherApiWeatherProvider } from "./providers/weather-api-weather.provider"
import { OpenMeteoWeatherProvider } from "./providers/open-meteo-weather.provider"
import { CACHE_METRICS_SERVICE } from "../metrics/services/cache-metrics.service"
import { MetricsModule } from "../metrics/metrics.module"

const queryHandlers = [GetWeatherHandler]

@Module({
  controllers: [WeatherController],
  imports: [CqrsModule, HttpModule, MetricsModule, SearchModule],
  providers: [
    ...queryHandlers,
    {
      provide: WeatherApiWeatherProvider,
      useFactory: weatherApiWeatherProviderFactory,
      inject: [ConfigService, HttpService]
    },
    {
      provide: OpenMeteoWeatherProvider,
      useFactory: openMeteoWeatherProviderFactory,
      inject: [ConfigService, HttpService, SEARCH_PROVIDER]
    },
    {
      provide: WEATHER_PROVIDER,
      useFactory: weatherProviderFactory,
      inject: [
        ConfigService,
        CACHE_MANAGER,
        CACHE_METRICS_SERVICE,
        WeatherApiWeatherProvider,
        OpenMeteoWeatherProvider
      ]
    }
  ],
  exports: queryHandlers
})
export class WeatherModule {}
