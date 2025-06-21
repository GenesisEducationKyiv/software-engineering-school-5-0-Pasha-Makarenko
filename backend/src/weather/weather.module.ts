import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { HttpModule, HttpService } from "@nestjs/axios"
import { WeatherController } from "./controllers/weather.controller"
import { GetWeatherHandler } from "./queries/handlers/get-weather.handler"
import {
  WEATHER_PROVIDER,
  weatherProviderFactory
} from "./providers/weather.provider.factory"
import { SEARCH_PROVIDER } from "../search/providers/search.provider.factory"
import { ConfigService } from "@nestjs/config"
import { SearchModule } from "../search/search.module"
import { CACHE_MANAGER } from "@nestjs/cache-manager"

const queryHandlers = [GetWeatherHandler]

@Module({
  controllers: [WeatherController],
  imports: [CqrsModule, HttpModule, SearchModule],
  providers: [
    ...queryHandlers,
    {
      provide: WEATHER_PROVIDER,
      useFactory: weatherProviderFactory,
      inject: [ConfigService, HttpService, SEARCH_PROVIDER, CACHE_MANAGER]
    }
  ],
  exports: queryHandlers
})
export class WeatherModule {}
