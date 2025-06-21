import { Module } from "@nestjs/common"
import { SearchController } from "./controllers/search.controller"
import { HttpModule, HttpService } from "@nestjs/axios"
import { GetCitiesHandler } from "./queries/handlers/get-cities.handler"
import { CqrsModule } from "@nestjs/cqrs"
import {
  SEARCH_PROVIDER,
  searchProviderFactory
} from "./providers/search.provider.factory"
import { ConfigService } from "@nestjs/config"
import { CACHE_MANAGER } from "@nestjs/cache-manager"

const queryHandlers = [GetCitiesHandler]

@Module({
  controllers: [SearchController],
  imports: [CqrsModule, HttpModule],
  providers: [
    ...queryHandlers,
    {
      provide: SEARCH_PROVIDER,
      useFactory: searchProviderFactory,
      inject: [ConfigService, HttpService, CACHE_MANAGER]
    }
  ],
  exports: [...queryHandlers, SEARCH_PROVIDER]
})
export class SearchModule {}
