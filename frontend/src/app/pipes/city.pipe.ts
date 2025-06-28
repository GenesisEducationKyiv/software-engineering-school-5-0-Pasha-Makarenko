import { Pipe, PipeTransform } from "@angular/core"
import { City } from "../api/search/search.interface"

@Pipe({
  name: "city"
})
export class CityPipe implements PipeTransform {
  transform(city: City | null, format: string): string {
    if (!city) {
      return ""
    }

    return format.replace("$n", city.name).replace("$c", city.country)
  }
}
