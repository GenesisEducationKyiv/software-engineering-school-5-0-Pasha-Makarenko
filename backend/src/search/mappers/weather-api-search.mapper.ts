import { WeatherApiSearchItem } from "../interfaces/weather-api.interface"
import { City } from "../interfaces/search.interface"

export const weatherApiSearchMapper: (
  data: WeatherApiSearchItem
) => City = data => ({
  id: data.id,
  name: data.name,
  country: data.country,
  lat: data.lat,
  lon: data.lon,
  url: data.url
})
