import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { GetCitiesQuery } from "../impl/get-cities.query"
import { Inject } from "@nestjs/common"
import { SEARCH_PROVIDER } from "../../providers/search.provider.factory"
import { ISearchProvider } from "../../interfaces/search.provider.interface"

@QueryHandler(GetCitiesQuery)
export class GetCitiesHandler implements IQueryHandler<GetCitiesQuery> {
  constructor(
    @Inject(SEARCH_PROVIDER)
    private searchProvider: ISearchProvider
  ) {}

  async execute(query: GetCitiesQuery) {
    const { city } = query

    return await this.searchProvider.search(city)
  }
}
