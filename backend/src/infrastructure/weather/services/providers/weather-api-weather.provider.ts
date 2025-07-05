import { HttpStatus, Injectable } from "@nestjs/common"
import { WeatherProviderAttributesDto } from "../../dto/weather-provider-attributes.dto"
import { HttpService } from "@nestjs/axios"
import { lastValueFrom } from "rxjs"
import { WeatherApiData } from "../../interfaces/weather-api.interface"
import { weatherApiWeatherMapper } from "../../persistance/mappers/weather-api-weather.mapper"
import { WeatherProviderException } from "../../exceptions/weather-provider.exception"
import { WeatherProviderHandler } from "./weather.provider.handler"
import { InvalidWeatherProviderKeyException } from "../../exceptions/invalid-weather-provider-key.exception"
import { CityNotFoundException } from "../../../../domain/search/exceptions/city-not-found.exception"
import { WeatherGetting } from "../../../../domain/weather/value-objects/weather-getting.value-object"

@Injectable()
export class WeatherApiWeatherProvider extends WeatherProviderHandler {
  constructor(
    private readonly attributes: WeatherProviderAttributesDto,
    private httpService: HttpService
  ) {
    super()
  }

  async handle(dto: WeatherGetting) {
    const { url, key } = this.attributes
    const { city, lat, lon, days } = dto

    const params = {
      key: key,
      q: `${lat},${lon}`,
      days: days,
      aqi: "no",
      alerts: "no"
    }

    try {
      const response = await lastValueFrom(
        this.httpService.get<WeatherApiData>(url, { params })
      )

      return weatherApiWeatherMapper(response.data)
    } catch (error) {
      switch (error.response?.status) {
        case HttpStatus.UNAUTHORIZED:
          throw new InvalidWeatherProviderKeyException(
            WeatherApiWeatherProvider.name
          )
        case HttpStatus.NOT_FOUND:
          throw new CityNotFoundException(city)
      }

      throw new WeatherProviderException(
        `Failed to fetch weather data from WeatherAPI: ${error.message}`,
        error
      )
    }
  }
}
