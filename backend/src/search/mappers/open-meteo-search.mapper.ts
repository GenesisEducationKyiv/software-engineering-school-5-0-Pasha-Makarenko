import { OpenMeteoSearchItem } from "../interfaces/open-meteo.interface"
import { City } from "../interfaces/search.interface"

export const openMeteoSearchMapper: (
  data: OpenMeteoSearchItem
) => City = data => ({
  id: data.id,
  name: data.name,
  country: data.country,
  lat: data.latitude,
  lon: data.longitude,
  url: data.name
})
