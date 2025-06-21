import { SearchProviderAttributesDto } from "../dto/search-provider-attributes.dto"
import { HttpService } from "@nestjs/axios"
import { lastValueFrom } from "rxjs"
import { WeatherApiSearch } from "../interfaces/weather-api.interface"
import { weatherApiSearchMapper } from "../mappers/weather-api-search.mapper"
import { SearchProviderException } from "../exceptions/search-provider.exception"
import { SearchProviderHandler } from "./search.provider.handler"

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
      throw new SearchProviderException(
        `Failed to search cities from WeatherAPI: ${error.message}`,
        error
      )
    }
  }
}
