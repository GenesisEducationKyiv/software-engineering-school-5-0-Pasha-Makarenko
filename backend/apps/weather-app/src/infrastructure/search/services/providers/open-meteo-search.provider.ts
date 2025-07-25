import { HttpStatus } from "@nestjs/common"
import { HttpService } from "@nestjs/axios"
import { lastValueFrom } from "rxjs"
import { SearchProviderAttributesDto } from "../../dto/search-provider-attributes.dto"
import { SearchProviderHandler } from "./search.provider.handler"
import { OpenMeteoSearch } from "../../interfaces/open-meteo.interface"
import { openMeteoSearchMapper } from "../../persistance/mappers/open-meteo-search.mapper"
import { UnauthorizedException } from "../../../common/exceptions/unauthorized.exception"
import { NotFoundException } from "../../../../domain/common/exceptions/not-found.exception"
import { ProviderException } from "../../../common/exceptions/provider.exception"

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
      switch (error.response?.status) {
        case HttpStatus.UNAUTHORIZED:
          throw new UnauthorizedException(
            `Unauthorized access to OpenMeteo API. Please check your API key: ${error.message}`,
            error
          )
        case HttpStatus.NOT_FOUND:
          throw new NotFoundException(`City not found in OpenMeteo: ${city}`)
      }

      throw new ProviderException(
        `Failed to search cities from OpenMeteo: ${error.message}`,
        error
      )
    }
  }
}
