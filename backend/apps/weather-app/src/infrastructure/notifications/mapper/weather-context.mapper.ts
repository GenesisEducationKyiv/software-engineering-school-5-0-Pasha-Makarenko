import { Injectable } from "@nestjs/common"
import { IWeatherContextMapper } from "../../../application/notifications/interfaces/weather-context.interface"
import { WeatherData } from "../../../domain/weather/value-objects/weather-data.value-object"
import {
  WeatherContext,
  WeatherContextHour
} from "../../../domain/notifications/value-objects/weather-context.value-object"

@Injectable()
export class WeatherContextMapper implements IWeatherContextMapper {
  map(data: WeatherData): WeatherContext {
    return WeatherContext.create(
      data.location.name,
      data.location.country,
      data.forecast[0].date,
      data.forecast[0].text,
      data.forecast[0].avgtemp,
      data.forecast[0].hours.map(hour =>
        WeatherContextHour.create(
          hour.time,
          hour.temp,
          hour.humidity,
          hour.wind
        )
      )
    )
  }
}
