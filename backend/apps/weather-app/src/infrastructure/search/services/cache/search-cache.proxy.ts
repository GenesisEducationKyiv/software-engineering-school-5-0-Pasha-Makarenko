import { Cache } from "cache-manager"
import {
  ISearchProvider,
  SEARCH_PROVIDER
} from "../../../../domain/search/providers/search.provider.interface"
import { ICacheMetricsService } from "../../../metrics/interfaces/cache-metrics.interface"
import { City } from "../../../../domain/search/entities/city.entity"
import { Logger } from "@nestjs/common"

export class SearchCacheProxy implements ISearchProvider {
  private readonly logger = new Logger(SEARCH_PROVIDER)

  constructor(
    private provider: ISearchProvider,
    private cacheManager: Cache,
    private cacheMetricsService: ICacheMetricsService,
    private readonly ttl: number
  ) {}

  async search(city: string) {
    this.logger.log({
      operation: "search",
      params: { city },
      message: "Searching for cities"
    })

    const cacheKey = `search:${city}`

    const cachedResult = await this.cacheManager.get<City[]>(cacheKey)

    if (cachedResult) {
      this.logger.log({
        operation: "search",
        params: { city },
        message: "Returning cached search results"
      })
      this.cacheMetricsService.recordCacheHit("search")
      return cachedResult
    }

    const result = await this.provider.search(city)

    this.logger.log({
      operation: "search",
      params: { city },
      message: "Search completed successfully from provider"
    })
    this.cacheMetricsService.recordCacheMiss("search")
    await this.cacheManager.set(cacheKey, result, this.ttl)

    return result
  }
}
