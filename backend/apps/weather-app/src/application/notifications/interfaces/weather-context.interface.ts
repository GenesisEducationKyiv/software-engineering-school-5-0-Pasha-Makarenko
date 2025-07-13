import { WeatherData } from "../../../domain/weather/value-objects/weather-data.value-object"

export interface WeatherContext {
  city: string
  country: string
  date: string
  description: string
  temperature: number
  hours: {
    time: string
    temperature: number
    humidity: number
    wind: number
  }[]
}

export const WEATHER_CONTEXT_MAPPER = "WEATHER_CONTEXT_MAPPER"

export interface IWeatherContextMapper {
  map(data: WeatherData): WeatherContext
}
