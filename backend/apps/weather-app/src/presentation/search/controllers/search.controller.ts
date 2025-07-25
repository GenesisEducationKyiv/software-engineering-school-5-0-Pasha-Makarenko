import { Controller, Get, HttpCode, HttpStatus, Query } from "@nestjs/common"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { QueryBus } from "@nestjs/cqrs"
import { GetCitiesQuery } from "../../../application/search/queries/impl/get-cities.query"
import { SearchQueryDto } from "../../../application/search/dto/search-query.dto"

@ApiTags("Search")
@Controller("search")
export class SearchController {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({ summary: "Search" })
  @ApiResponse({ status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  @Get()
  async search(@Query() dto: SearchQueryDto) {
    return await this.queryBus.execute(new GetCitiesQuery(dto))
  }
}
