import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { GetCitiesQuery } from "../get-cities.query"
import { HttpService } from "@nestjs/axios"
import { BadRequestException } from "@nestjs/common"
import { lastValueFrom } from "rxjs"
import { City } from "../../search.interface"
import { UrlGeneratorService } from "../../../url-generator/url-generator.service"

@QueryHandler(GetCitiesQuery)
export class GetCitiesHandler implements IQueryHandler<GetCitiesQuery> {
  constructor(
    private urlGeneratorService: UrlGeneratorService,
    private httpService: HttpService
  ) {}

  async execute(query: GetCitiesQuery) {
    const { city } = query
    const { url, params } = await this.urlGeneratorService.searchUrl(city)

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
