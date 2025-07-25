import { Cache } from "cache-manager"
import { ISearchProvider } from "../../../../domain/search/providers/search.provider.interface"
import { ICacheMetricsService } from "../../../metrics/interfaces/cache-metrics.interface"
import { City } from "../../../../domain/search/entities/city.entity"

export class SearchCacheProxy implements ISearchProvider {
  constructor(
    private provider: ISearchProvider,
    private cacheManager: Cache,
    private cacheMetricsService: ICacheMetricsService,
    private readonly ttl: number
  ) {}

  async search(city: string) {
    const cacheKey = `search:${city}`

    const cachedResult = await this.cacheManager.get<City[]>(cacheKey)

    if (cachedResult) {
      this.cacheMetricsService.recordCacheHit("search")
      return cachedResult
    }

    const result = await this.provider.search(city)

    this.cacheMetricsService.recordCacheMiss("search")
    await this.cacheManager.set(cacheKey, result, this.ttl)

    return result
  }
}
