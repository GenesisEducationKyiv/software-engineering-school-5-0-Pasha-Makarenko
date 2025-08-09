import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Query
} from "@nestjs/common"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { QueryBus } from "@nestjs/cqrs"
import { GetCitiesQuery } from "../../../application/search/queries/impl/get-cities.query"
import { SearchQueryDto } from "../../../application/search/dto/search-query.dto"

@ApiTags("Search")
@Controller("search")
export class SearchController {
  private readonly logger = new Logger(SearchController.name)

  constructor(private queryBus: QueryBus) {}

  @ApiOperation({ summary: "Search" })
  @ApiResponse({ status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  @Get()
  async search(@Query() dto: SearchQueryDto) {
    this.logger.log({
      operation: "search",
      params: dto,
      message: "Searching for cities"
    })
    const result = await this.queryBus.execute(new GetCitiesQuery(dto))
    this.logger.log({
      operation: "search",
      params: dto,
      message: "Cities search completed successfully"
    })
    return result
  }
}
