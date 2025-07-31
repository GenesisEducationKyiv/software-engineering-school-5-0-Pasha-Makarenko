import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { GetCitiesQuery } from "../impl/get-cities.query"
import { Inject, Logger } from "@nestjs/common"
import {
  ISearchProvider,
  SEARCH_PROVIDER
} from "../../../../domain/search/providers/search.provider.interface"
import {
  ISearchMetricsService,
  SEARCH_METRICS_SERVICE
} from "../../../metrics/interfaces/search-metrics.interface"

@QueryHandler(GetCitiesQuery)
export class GetCitiesHandler implements IQueryHandler<GetCitiesQuery> {
  private readonly logger = new Logger(GetCitiesHandler.name)

  constructor(
    @Inject(SEARCH_PROVIDER)
    private searchProvider: ISearchProvider,
    @Inject(SEARCH_METRICS_SERVICE)
    private searchMetricsService: ISearchMetricsService
  ) {}

  async execute(query: GetCitiesQuery) {
    const { dto } = query
    const startTime = Date.now()

    this.logger.log({
      operation: "getCities",
      params: dto,
      message: "Searching for cities"
    })
    this.searchMetricsService.startSearchRequest(dto.city)

    try {
      const result = await this.searchProvider.search(dto.city)

      this.searchMetricsService.recordSearchRequest(
        dto.city,
        Date.now() - startTime
      )
      this.logger.log({
        operation: "getCities",
        params: dto,
        message: "Cities search completed successfully"
      })

      return result
    } catch (error) {
      this.searchMetricsService.recordSearchRequestError(dto.city)
      throw error
    } finally {
      this.searchMetricsService.endSearchRequest(dto.city)
    }
  }
}
