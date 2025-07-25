import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { GetCitiesQuery } from "../impl/get-cities.query"
import { Inject } from "@nestjs/common"
import {
  ISearchProvider,
  SEARCH_PROVIDER
} from "../../../../domain/search/providers/search.provider.interface"

@QueryHandler(GetCitiesQuery)
export class GetCitiesHandler implements IQueryHandler<GetCitiesQuery> {
  constructor(
    @Inject(SEARCH_PROVIDER)
    private searchProvider: ISearchProvider
  ) {}

  async execute(query: GetCitiesQuery) {
    const { dto } = query

    return await this.searchProvider.search(dto.city)
  }
}
