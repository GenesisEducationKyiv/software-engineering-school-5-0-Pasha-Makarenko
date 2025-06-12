import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { GetWeatherQuery } from "../get-weather.query"
import { HttpService } from "@nestjs/axios"
import { BadRequestException } from "@nestjs/common"
import { lastValueFrom } from "rxjs"
import { WeatherData } from "../../weather.interface"
import { UrlGeneratorService } from "../../../url-generator/url-generator.service"

@QueryHandler(GetWeatherQuery)
export class GetWeatherHandler implements IQueryHandler<GetWeatherQuery> {
  constructor(
    private urlGeneratorService: UrlGeneratorService,
    private httpService: HttpService
  ) {}

  async execute(query: GetWeatherQuery) {
    const { dto } = query
    const { url, params } = await this.urlGeneratorService.weatherUrl(dto)

    try {
      const response = await lastValueFrom(
        this.httpService.get<WeatherData>(url, { params })
      )

      return response.data
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
