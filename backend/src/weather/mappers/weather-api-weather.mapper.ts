import { WeatherApiData } from "../interfaces/weather-api.interface"
import { WeatherData } from "../interfaces/weather.interface"

export const weatherApiWeatherMapper: (
  data: WeatherApiData
) => WeatherData = data => ({
  location: {
    name: data.location.name,
    country: data.location.country,
    lat: data.location.lat,
    lon: data.location.lon
  },
  forecast: data.forecast.forecastday.map(day => ({
    date: day.date,
    mintemp: day.day.mintemp_c,
    maxtemp: day.day.maxtemp_c,
    avgtemp: day.day.avgtemp_c,
    text: day.day.condition.text,
    icon: day.day.condition.icon,
    hours: day.hour.map(hour => ({
      time: hour.time.split(" ")[1],
      temp: hour.temp_c,
      wind: hour.wind_kph,
      humidity: hour.humidity,
      icon: hour.condition.icon
    }))
  }))
})
