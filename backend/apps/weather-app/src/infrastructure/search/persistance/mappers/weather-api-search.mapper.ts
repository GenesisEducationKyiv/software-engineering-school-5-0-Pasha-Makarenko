import { WeatherApiSearchItem } from "../../interfaces/weather-api.interface"
import { City } from "../../../../domain/search/entities/city.entity"
import { weatherApiSearchItemSchema } from "../validation/weather-api-search.schema"
import { ValidationUtil } from "../../../common/utils/validation.util"

export const weatherApiSearchMapper: (
  data: WeatherApiSearchItem
) => City = data => {
  const validatedData =
    ValidationUtil.validateWithCustomError<WeatherApiSearchItem>(
      weatherApiSearchItemSchema,
      data,
      "WeatherAPI search item validation failed"
    )

  return City.create(
    validatedData.id,
    validatedData.name,
    validatedData.country,
    validatedData.lat,
    validatedData.lon,
    validatedData.url
  )
}
