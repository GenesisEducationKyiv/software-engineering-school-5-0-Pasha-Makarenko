import { WeatherApiData } from "../../interfaces/weather-api.interface"
import {
  WeatherData,
  WeatherDay,
  WeatherHour,
  WeatherLocation
} from "../../../../domain/weather/value-objects/weather-data.value-object"
import { weatherApiWeatherSchema } from "../validation/weather-api-weather.schema"
import { ValidationUtil } from "../../../common/utils/validation.util"

export const weatherApiWeatherMapper: (
  data: WeatherApiData
) => WeatherData = data => {
  const validatedData = ValidationUtil.validateWithCustomError<WeatherApiData>(
    weatherApiWeatherSchema,
    data,
    "WeatherAPI weather data validation failed"
  )

  return WeatherData.create(
    WeatherLocation.create(
      validatedData.location.name,
      validatedData.location.country,
      validatedData.location.lat,
      validatedData.location.lon
    ),
    validatedData.forecast.forecastday.map(day =>
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
}
