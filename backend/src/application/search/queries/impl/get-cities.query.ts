import { Query } from "@nestjs/cqrs"
import { City } from "../../../../domain/search/entities/city.entity"

export class GetCitiesQuery extends Query<City[]> {
  constructor(public readonly city: string) {
    super()
  }
}
