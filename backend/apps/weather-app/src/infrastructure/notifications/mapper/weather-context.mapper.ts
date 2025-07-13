import { Injectable } from "@nestjs/common"
import {
  IWeatherContextMapper,
  WeatherContext
} from "../../../application/notifications/interfaces/weather-context.interface"
import { WeatherData } from "../../../domain/weather/value-objects/weather-data.value-object"

@Injectable()
export class WeatherContextMapper implements IWeatherContextMapper {
  map(data: WeatherData): WeatherContext {
    return {
      city: data.location.name,
      country: data.location.country,
      date: data.forecast[0].date,
      description: data.forecast[0].text,
      temperature: data.forecast[0].avgtemp,
      hours: data.forecast[0].hours.map(hour => ({
        time: hour.time,
        temperature: hour.temp,
        humidity: hour.humidity,
        wind: hour.wind
      }))
    }
  }
}
