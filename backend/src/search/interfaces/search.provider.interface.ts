import { City } from "./search.interface"

export interface ISearchProvider {
  search(city: string): Promise<City[]>
}
