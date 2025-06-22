import { SearchProviderAttributesDto } from "../dto/search-provider-attributes.dto"
import { HttpService } from "@nestjs/axios"
import { lastValueFrom } from "rxjs"
import { OpenMeteoSearch } from "../interfaces/open-meteo.interface"
import { openMeteoSearchMapper } from "../mappers/open-meteo-search.mapper"
import { SearchProviderException } from "../exceptions/search-provider.exception"
import { SearchProviderHandler } from "./search.provider.handler"

export class OpenMeteoSearchProvider extends SearchProviderHandler {
  constructor(
    private readonly attributes: SearchProviderAttributesDto,
    private httpService: HttpService
  ) {
    super()
  }

  async handle(city: string) {
    const { url, key } = this.attributes

    const params = {
      name: city,
      count: 10,
      language: "en",
      format: "json"
    }

    if (key) {
      params["apikey"] = key
    }

    try {
      const response = await lastValueFrom(
        this.httpService.get<OpenMeteoSearch>(url, { params })
      )

      if (!response.data?.results) {
        return []
      }

      return response.data.results.map(openMeteoSearchMapper)
    } catch (error) {
      throw new SearchProviderException(
        `Failed to search cities from OpenMeteo: ${error.message}`,
        error
      )
    }
  }
}
