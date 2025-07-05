import { WeatherApiSearchItem } from "../../interfaces/weather-api.interface"
import { City } from "../../../../domain/search/value-objects/city.value-object"

export const weatherApiSearchMapper: (
  data: WeatherApiSearchItem
) => City = data =>
  City.create(data.id, data.name, data.country, data.lat, data.lon, data.url)
