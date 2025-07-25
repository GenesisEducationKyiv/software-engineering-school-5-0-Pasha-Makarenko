import { OpenMeteoData } from "../../interfaces/open-meteo.interface"
import { openMeteoWeatherCodeConst } from "../../consts/open-meteo-weather-code.const"
import { City } from "../../../../domain/search/entities/city.entity"
import {
  WeatherData,
  WeatherDay,
  WeatherHour,
  WeatherLocation
} from "../../../../domain/weather/value-objects/weather-data.value-object"
import { openMeteoWeatherSchema } from "../validation/open-meteo-weather.schema"
import { ValidationUtil } from "../../../common/utils/validation.util"

export const openMeteoWeatherMapper: (
  data: OpenMeteoData,
  city: City
) => WeatherData = (data, city) => {
  const validatedData = ValidationUtil.validateWithCustomError<OpenMeteoData>(
    openMeteoWeatherSchema,
    data,
    "OpenMeteo weather data validation failed"
  )

  const dayCount = validatedData.hourly.time.length / 24

  const forecast: WeatherDay[] = []

  for (let i = 0; i < dayCount; i++) {
    const startIndex = i * 24
    const endIndex = startIndex + 24

    const dailyData = validatedData.hourly.time
      .slice(startIndex, endIndex)
      .map((time, index) => {
        const weatherCode =
          validatedData.hourly.weather_code[startIndex + index]
        const type = validatedData.hourly.is_day[startIndex + index]
          ? "day"
          : "night"

        return WeatherHour.create(
          time.split("T")[1],
          validatedData.hourly.temperature_2m[startIndex + index],
          validatedData.hourly.wind_speed_10m[startIndex + index],
          validatedData.hourly.relative_humidity_2m[startIndex + index],
          openMeteoWeatherCodeConst[weatherCode][type].image
        )
      })

    const weatherCode = validatedData.daily.weather_code[i]

    forecast.push(
      WeatherDay.create(
        validatedData.daily.time[i],
        Math.min(...dailyData.map(d => d.temp)),
        Math.max(...dailyData.map(d => d.temp)),
        dailyData.reduce((sum, d) => sum + d.temp, 0) / dailyData.length,
        openMeteoWeatherCodeConst[weatherCode].day.description,
        openMeteoWeatherCodeConst[weatherCode].day.image,
        dailyData
      )
    )
  }

  return WeatherData.create(
    WeatherLocation.create(
      city.name,
      city.country,
      validatedData.latitude,
      validatedData.longitude
    ),
    forecast
  )
}
