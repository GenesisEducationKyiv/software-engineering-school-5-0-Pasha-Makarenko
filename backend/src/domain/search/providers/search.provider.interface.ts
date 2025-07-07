import { City } from "../entities/city.entity"

export const SEARCH_PROVIDER = "SEARCH_PROVIDER"

export interface ISearchProvider {
  search(city: string): Promise<City[]>
}
