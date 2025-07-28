import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { GetCitiesQuery } from "../impl/get-cities.query"
import { Inject, Logger } from "@nestjs/common"
import {
  ISearchProvider,
  SEARCH_PROVIDER
} from "../../../../domain/search/providers/search.provider.interface"

@QueryHandler(GetCitiesQuery)
export class GetCitiesHandler implements IQueryHandler<GetCitiesQuery> {
  private readonly logger = new Logger(GetCitiesHandler.name)

  constructor(
    @Inject(SEARCH_PROVIDER)
    private searchProvider: ISearchProvider
  ) {}

  async execute(query: GetCitiesQuery) {
    const { dto } = query
    this.logger.log({
      operation: "getCities",
      params: dto,
      message: "Searching for cities"
    })
    const result = await this.searchProvider.search(dto.city)
    this.logger.log({
      operation: "getCities",
      params: dto,
      message: "Cities search completed successfully"
    })
    return result
  }
}
