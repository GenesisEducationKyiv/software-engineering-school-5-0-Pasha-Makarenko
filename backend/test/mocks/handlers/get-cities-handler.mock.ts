import { citiesMock } from "../data/search.mock"
import { GetCitiesQuery } from "../../../src/search/queries/impl/get-cities.query"
import { QueryHandler } from "../services/cqrs.mock"
import { City } from "../../../src/search/interfaces/search.interface"

export class GetCitiesQueryHandler
  implements QueryHandler<GetCitiesQuery, City[]>
{
  async handle(_query: GetCitiesQuery) {
    return citiesMock
  }
}
