import { OpenMeteoData } from "../interfaces/open-meteo.interface"
import { WeatherData } from "../interfaces/weather.interface"
import { City } from "../../search/interfaces/search.interface"
import { openMeteoWeatherCodeConst } from "../consts/open-meteo-weather-code.const"

export const openMeteoWeatherMapper: (
  data: OpenMeteoData,
  city: City
) => WeatherData = (data, city) => {
  const dayCount = data.hourly.time.length / 24

  const result: WeatherData = {
    location: {
      name: city.name,
      country: city.country,
      lat: data.latitude,
      lon: data.longitude
    },
    forecast: []
  }

  for (let i = 0; i < dayCount; i++) {
    const startIndex = i * 24
    const endIndex = startIndex + 24

    const dailyData = data.hourly.time
      .slice(startIndex, endIndex)
      .map((time, index) => {
        const weatherCode = data.hourly.weather_code[startIndex + index]
        const type = data.hourly.iss_day[startIndex + index] ? "day" : "night"

        return {
          time: time.split("T")[1],
          temp: data.hourly.temperature_2m[startIndex + index],
          wind: data.hourly.wind_speed_10m[startIndex + index],
          humidity: data.hourly.relative_humidity_2m[startIndex + index],
          icon: openMeteoWeatherCodeConst[weatherCode][type].image
        }
      })

    const weatherCode = data.daily.weather_code[i]

    result.forecast.push({
      date: data.daily[i].time,
      mintemp: Math.min(...dailyData.map(d => d.temp)),
      maxtemp: Math.max(...dailyData.map(d => d.temp)),
      avgtemp: dailyData.reduce((sum, d) => sum + d.temp, 0) / dailyData.length,
      hours: dailyData,
      text: openMeteoWeatherCodeConst[weatherCode].day.description,
      icon: openMeteoWeatherCodeConst[weatherCode].day.image
    })
  }

  return result
}
