import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { WeatherUrlGeneratorService } from "./services/weather-url-generator.service"
import { ClientUrlGeneratorService } from "./services/client-url-generator.service"

@Module({
  imports: [CqrsModule],
  providers: [WeatherUrlGeneratorService, ClientUrlGeneratorService],
  exports: [WeatherUrlGeneratorService, ClientUrlGeneratorService]
})
export class UrlGeneratorModule {}
