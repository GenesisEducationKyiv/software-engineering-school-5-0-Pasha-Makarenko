import { HttpStatus, Inject, Injectable } from "@nestjs/common"
import { WeatherProviderAttributesDto } from "../../dto/weather-provider-attributes.dto"
import { HttpService } from "@nestjs/axios"
import { lastValueFrom } from "rxjs"
import {
  ISearchProvider,
  SEARCH_PROVIDER
} from "../../../../domain/search/providers/search.provider.interface"
import { OpenMeteoData } from "../../interfaces/open-meteo.interface"
import { openMeteoWeatherMapper } from "../../persistance/mappers/open-meteo-weather.mapper"
import { WeatherProviderHandler } from "./weather.provider.handler"
import { findClosedCity } from "../../../search/utils/find-closed-city.util"
import { WeatherGetting } from "../../../../domain/weather/value-objects/weather-getting.value-object"
import { ProviderException } from "../../../common/exceptions/provider.exception"
import { NotFoundException } from "../../../../domain/common/exceptions/not-found.exception"
import { UnauthorizedException } from "../../../common/exceptions/unauthorized.exception"

@Injectable()
export class OpenMeteoWeatherProvider extends WeatherProviderHandler {
  constructor(
    private readonly attributes: WeatherProviderAttributesDto,
    private httpService: HttpService,
    @Inject(SEARCH_PROVIDER)
    private searchProvider: ISearchProvider
  ) {
    super()
  }

  async handle(dto: WeatherGetting) {
    const { url, key } = this.attributes
    const { city, lat, lon, days } = dto

    const cities = await this.searchProvider.search(city)

    if (!cities || cities.length === 0) {
      throw new NotFoundException(
        `No cities found for the provided city name: ${city}`
      )
    }

    const currentCity = findClosedCity(cities, lat, lon)

    if (!currentCity) {
      throw new NotFoundException(
        `No city found close to the provided coordinates: lat=${lat}, lon=${lon}`
      )
    }

    const params = {
      latitude: lat,
      longitude: lon,
      hourly:
        "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day",
      daily: "weather_code",
      forecast_days: days,
      timezone: "auto"
    }

    if (key) {
      params["apikey"] = key
    }

    try {
      const response = await lastValueFrom(
        this.httpService.get<OpenMeteoData>(url, { params })
      )
      return openMeteoWeatherMapper(response.data, currentCity)
    } catch (error) {
      switch (error.response?.status) {
        case HttpStatus.UNAUTHORIZED:
          throw new UnauthorizedException(
            `Invalid API key for OpenMeteo: ${this.attributes.key}`,
            error
          )
        case HttpStatus.NOT_FOUND:
          throw new NotFoundException(
            `City not found for coordinates: lat=${lat}, lon=${lon}`
          )
      }

      throw new ProviderException(
        `Failed to fetch weather data from OpenMeteo: ${error.message}`,
        error
      )
    }
  }
}
