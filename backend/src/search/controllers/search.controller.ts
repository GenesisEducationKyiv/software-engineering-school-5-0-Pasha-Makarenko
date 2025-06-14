import { Controller, Get, Query } from "@nestjs/common"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { QueryBus } from "@nestjs/cqrs"
import { GetCitiesQuery } from "../queries/impl/get-cities.query"

@ApiTags("Search")
@Controller("search")
export class SearchController {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({ summary: "Search" })
  @ApiResponse({ status: 200 })
  @Get()
  async search(@Query("city") city: string) {
    return await this.queryBus.execute(new GetCitiesQuery(city))
  }
}
