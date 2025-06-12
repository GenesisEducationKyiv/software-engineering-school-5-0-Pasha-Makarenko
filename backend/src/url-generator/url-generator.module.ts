import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { UrlGeneratorService } from "./url-generator.service"
import { GetConfirmUrlHandler } from "./queries/handlers/get-confirm-url.handler"
import { GetSearchUrlHandler } from "./queries/handlers/get-search-url.handler"
import { GetWeatherUrlHandler } from "./queries/handlers/get-weather-url.handler"
import { GetUnsubscribeUrlHandler } from "./queries/handlers/get-unsubscribe-url.handler"

const queryHandlers = [
  GetConfirmUrlHandler,
  GetSearchUrlHandler,
  GetUnsubscribeUrlHandler,
  GetWeatherUrlHandler
]

@Module({
  imports: [CqrsModule],
  providers: [UrlGeneratorService, ...queryHandlers],
  exports: [UrlGeneratorService, ...queryHandlers]
})
export class UrlGeneratorModule {}
