import { Module } from "@nestjs/common"
import { SearchController } from "./controllers/search.controller"
import { HttpModule } from "@nestjs/axios"
import { GetCitiesHandler } from "./queries/handlers/get-cities.handler"
import { CqrsModule } from "@nestjs/cqrs"
import { UrlGeneratorModule } from "../url-generator/url-generator.module"

const queryHandlers = [GetCitiesHandler]

@Module({
  controllers: [SearchController],
  imports: [CqrsModule, HttpModule, UrlGeneratorModule],
  providers: queryHandlers,
  exports: queryHandlers
})
export class SearchModule {}
