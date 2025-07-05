import { Query } from "@nestjs/cqrs"
import { City } from "../../../../domain/search/value-objects/city.value-object"

export class GetCitiesQuery extends Query<City[]> {
  constructor(public readonly city: string) {
    super()
  }
}
