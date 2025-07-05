import { WeatherApiData } from "../../interfaces/weather-api.interface"
import {
  WeatherData,
  WeatherDay,
  WeatherHour,
  WeatherLocation
} from "../../../../domain/weather/value-objects/weather-data.value-object"

export const weatherApiWeatherMapper: (
  data: WeatherApiData
) => WeatherData = data =>
  WeatherData.create(
    WeatherLocation.create(
      data.location.name,
      data.location.country,
      data.location.lat,
      data.location.lon
    ),
    data.forecast.forecastday.map(day =>
      WeatherDay.create(
        day.date,
        day.day.mintemp_c,
        day.day.maxtemp_c,
        day.day.avgtemp_c,
        day.day.condition.text,
        day.day.condition.icon,
        day.hour.map(hour =>
          WeatherHour.create(
            hour.time.split(" ")[1],
            hour.temp_c,
            hour.wind_kph,
            hour.humidity,
            hour.condition.icon
          )
        )
      )
    )
  )
