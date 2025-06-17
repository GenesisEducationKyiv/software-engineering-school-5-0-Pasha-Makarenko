import { Query } from "@nestjs/cqrs"
import { City } from "../../interfaces/search.interface"

export class GetCitiesQuery extends Query<City[]> {
  constructor(public readonly city: string) {
    super()
  }
}
