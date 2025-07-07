import { WeatherApiSearchItem } from "../../interfaces/weather-api.interface"
import { City } from "../../../../domain/search/entities/city.entity"

export const weatherApiSearchMapper: (
  data: WeatherApiSearchItem
) => City = data =>
  City.create(data.id, data.name, data.country, data.lat, data.lon, data.url)
