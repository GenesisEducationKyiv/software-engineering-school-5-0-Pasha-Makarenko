import { OpenMeteoSearchItem } from "../../interfaces/open-meteo.interface"
import { City } from "../../../../domain/search/entities/city.entity"
import { openMeteoSearchItemSchema } from "../validation/open-meteo-search.schema"
import { ValidationUtil } from "../../../common/utils/validation.util"

export const openMeteoSearchMapper: (
  data: OpenMeteoSearchItem
) => City = data => {
  const validatedData =
    ValidationUtil.validateWithCustomError<OpenMeteoSearchItem>(
      openMeteoSearchItemSchema,
      data,
      "OpenMeteo search item validation failed"
    )

  return City.create(
    validatedData.id,
    validatedData.name,
    validatedData.country,
    validatedData.latitude,
    validatedData.longitude,
    validatedData.name
  )
}
