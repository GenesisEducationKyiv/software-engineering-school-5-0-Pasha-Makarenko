import { BadRequestException, Inject, Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Cache } from "cache-manager"
import { QueryBus } from "@nestjs/cqrs"
import { GetCitiesQuery } from "./queries/get-cities.query"

@Injectable()
export class SearchService {
  constructor(
    private configService: ConfigService,
    private queryBus: QueryBus,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async search(city: string) {
    const cacheKey = `search_${city}`
    const cachedData = await this.cacheManager.get<string[]>(cacheKey)

    if (cachedData) {
      return cachedData
    }

    const searchData = await this.queryBus.execute(new GetCitiesQuery(city))

    if (!searchData || searchData.length === 0) {
      throw new BadRequestException(`No results found for query: ${city}`)
    }

    const ttl = Number(this.configService.get<number>("SEARCH_CACHE_TTL"))
    await this.cacheManager.set(cacheKey, searchData, ttl)

    return searchData
  }
}
