import { OpenMeteoSearchItem } from "../../interfaces/open-meteo.interface"
import { City } from "../../../../domain/search/entities/city.entity"

export const openMeteoSearchMapper: (
  data: OpenMeteoSearchItem
) => City = data =>
  City.create(
    data.id,
    data.name,
    data.country,
    data.latitude,
    data.longitude,
    data.name
  )
