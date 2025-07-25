import { Query } from "@nestjs/cqrs"
import { City } from "../../../../domain/search/entities/city.entity"
import { SearchQueryDto } from "../../dto/search-query.dto"

export class GetCitiesQuery extends Query<City[]> {
  constructor(public readonly dto: SearchQueryDto) {
    super()
  }
}
