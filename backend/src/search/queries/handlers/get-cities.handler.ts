import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { GetCitiesQuery } from "../impl/get-cities.query"
import { HttpService } from "@nestjs/axios"
import { BadRequestException, Inject } from "@nestjs/common"
import { lastValueFrom } from "rxjs"
import { City } from "../../interfaces/search.interface"
import { UrlGeneratorService } from "../../../url-generator/services/url-generator.service"
import { Cacheable } from "../../../shared/decorators/cacheable.decorator"
import { ConfigService } from "@nestjs/config"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Cache } from "cache-manager"

@QueryHandler(GetCitiesQuery)
export class GetCitiesHandler implements IQueryHandler<GetCitiesQuery> {
  constructor(
    private urlGeneratorService: UrlGeneratorService,
    private httpService: HttpService,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @Cacheable({
    key: (query: GetCitiesQuery) => {
      return `search_${query.city}`
    },
    ttl: configService => configService.get<number>("SEARCH_CACHE_TTL")
  })
  async execute(query: GetCitiesQuery) {
    const { city } = query
    const { url, params } = this.urlGeneratorService.searchUrl(city)

    try {
      const response = await lastValueFrom(
        this.httpService.get<City[]>(url, { params })
      )

      return response.data
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
