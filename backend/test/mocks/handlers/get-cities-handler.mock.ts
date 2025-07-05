import { QueryHandler } from "../services/cqrs.mock"
import { GetCitiesQuery } from "../../../src/application/search/queries/impl/get-cities.query"
import { City } from "../../../src/domain/search/value-objects/city.value-object"
import { citiesMock } from "../data/search.mock"

export class GetCitiesQueryHandler
  implements QueryHandler<GetCitiesQuery, City[]>
{
  async handle(_query: GetCitiesQuery) {
    return citiesMock
  }
}
