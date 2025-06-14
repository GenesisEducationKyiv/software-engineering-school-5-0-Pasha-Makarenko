import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { HttpModule } from "@nestjs/axios"
import { WeatherController } from "./controllers/weather.controller"
import { GetWeatherHandler } from "./queries/handlers/get-weather.handler"
import { UrlGeneratorModule } from "../url-generator/url-generator.module"

const queryHandlers = [GetWeatherHandler]

@Module({
  controllers: [WeatherController],
  imports: [CqrsModule, HttpModule, UrlGeneratorModule],
  providers: queryHandlers,
  exports: queryHandlers
})
export class WeatherModule {}
