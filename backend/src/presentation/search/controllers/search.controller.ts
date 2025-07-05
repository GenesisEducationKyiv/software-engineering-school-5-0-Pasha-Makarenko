import { Controller, Get, HttpCode, HttpStatus, Query } from "@nestjs/common"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { QueryBus } from "@nestjs/cqrs"
import { GetCitiesQuery } from "../../../application/search/queries/impl/get-cities.query"

@ApiTags("Search")
@Controller("search")
export class SearchController {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({ summary: "Search" })
  @ApiResponse({ status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  @Get()
  async search(@Query("city") city: string) {
    return await this.queryBus.execute(new GetCitiesQuery(city))
  }
}
