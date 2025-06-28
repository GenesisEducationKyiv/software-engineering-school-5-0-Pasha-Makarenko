import { ISearchProvider } from "../interfaces/search.provider.interface"
import { Cache } from "cache-manager"
import { City } from "../interfaces/search.interface"

export class SearchCacheProxy implements ISearchProvider {
  constructor(
    private provider: ISearchProvider,
    private cacheManager: Cache,
    private readonly ttl: number
  ) {}

  async search(city: string) {
    const cacheKey = `search:${city}`

    const cachedResult = await this.cacheManager.get<City[]>(cacheKey)

    if (cachedResult) {
      return cachedResult
    }

    const result = await this.provider.search(city)

    await this.cacheManager.set(cacheKey, result, this.ttl)

    return result
  }
}
