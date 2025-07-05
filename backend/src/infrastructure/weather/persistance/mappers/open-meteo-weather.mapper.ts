import { OpenMeteoData } from "../../interfaces/open-meteo.interface"
import { openMeteoWeatherCodeConst } from "../../consts/open-meteo-weather-code.const"
import { City } from "../../../../domain/search/value-objects/city.value-object"
import {
  WeatherData,
  WeatherDay,
  WeatherHour,
  WeatherLocation
} from "../../../../domain/weather/value-objects/weather-data.value-object"

export const openMeteoWeatherMapper: (
  data: OpenMeteoData,
  city: City
) => WeatherData = (data, city) => {
  const dayCount = data.hourly.time.length / 24

  const forecast: WeatherDay[] = []

  for (let i = 0; i < dayCount; i++) {
    const startIndex = i * 24
    const endIndex = startIndex + 24

    const dailyData = data.hourly.time
      .slice(startIndex, endIndex)
      .map((time, index) => {
        const weatherCode = data.hourly.weather_code[startIndex + index]
        const type = data.hourly.is_day[startIndex + index] ? "day" : "night"

        return WeatherHour.create(
          time.split("T")[1],
          data.hourly.temperature_2m[startIndex + index],
          data.hourly.wind_speed_10m[startIndex + index],
          data.hourly.relative_humidity_2m[startIndex + index],
          openMeteoWeatherCodeConst[weatherCode][type].image
        )
      })

    const weatherCode = data.daily.weather_code[i]

    forecast.push(
      WeatherDay.create(
        data.daily.time[i],
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
      data.latitude,
      data.longitude
    ),
    forecast
  )
}
