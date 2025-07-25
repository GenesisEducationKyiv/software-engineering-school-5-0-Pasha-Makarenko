import { QueryHandler } from "../services/cqrs.mock"
import { GetCitiesQuery } from "../../../src/application/search/queries/impl/get-cities.query"
import { City } from "../../../src/domain/search/entities/city.entity"
import { citiesMock } from "../data/search.mock"

export class GetCitiesQueryHandler
  implements QueryHandler<GetCitiesQuery, City[]>
{
  async handle(_query: GetCitiesQuery) {
    return citiesMock
  }
}
