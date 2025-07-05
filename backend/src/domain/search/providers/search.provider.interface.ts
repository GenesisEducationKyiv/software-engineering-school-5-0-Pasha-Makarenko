import { City } from "../value-objects/city.value-object"

export const SEARCH_PROVIDER = "SEARCH_PROVIDER"

export interface ISearchProvider {
  search(city: string): Promise<City[]>
}
