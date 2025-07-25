import { HttpStatus } from "@nestjs/common"
import { HttpService } from "@nestjs/axios"
import { lastValueFrom } from "rxjs"
import { SearchProviderHandler } from "./search.provider.handler"
import { SearchProviderAttributesDto } from "../../dto/search-provider-attributes.dto"
import { WeatherApiSearch } from "../../interfaces/weather-api.interface"
import { weatherApiSearchMapper } from "../../persistance/mappers/weather-api-search.mapper"
import { UnauthorizedException } from "../../../common/exceptions/unauthorized.exception"
import { NotFoundException } from "../../../../domain/common/exceptions/not-found.exception"
import { ProviderException } from "../../../common/exceptions/provider.exception"

export class WeatherApiSearchProvider extends SearchProviderHandler {
  constructor(
    private readonly attributes: SearchProviderAttributesDto,
    private httpService: HttpService
  ) {
    super()
  }

  async handle(city: string) {
    const { url, key } = this.attributes

    const params = {
      key: key,
      q: city
    }

    try {
      const response = await lastValueFrom(
        this.httpService.get<WeatherApiSearch>(url, { params })
      )
      return (response.data || []).map(weatherApiSearchMapper)
    } catch (error) {
      switch (error.response?.status) {
        case HttpStatus.UNAUTHORIZED:
          throw new UnauthorizedException(
            `Unauthorized access to WeatherAPI. Please check your API key: ${error.message}`,
            error
          )
        case HttpStatus.NOT_FOUND:
          throw new NotFoundException(`City not found in WeatherAPI: ${city}`)
      }

      throw new ProviderException(
        `Failed to search cities from WeatherAPI: ${error.message}`,
        error
      )
    }
  }
}
