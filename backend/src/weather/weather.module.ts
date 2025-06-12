import { Module } from "@nestjs/common"
import { WeatherController } from "./weather.controller"
import { WeatherService } from "./weather.service"
import { HttpModule } from "@nestjs/axios"
import { CqrsModule } from "@nestjs/cqrs"
import { GetWeatherHandler } from "./queries/handlers/get-weather.handler"
import { UrlGeneratorModule } from "../url-generator/url-generator.module"

const queryHandlers = [GetWeatherHandler]

@Module({
  controllers: [WeatherController],
  imports: [CqrsModule, HttpModule, UrlGeneratorModule],
  providers: [WeatherService, ...queryHandlers],
  exports: [WeatherService, ...queryHandlers]
})
export class WeatherModule {}
