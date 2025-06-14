import { City } from "../../api/search/search.interface"

export interface CityState {
  city: City | null
}

export const initialCityState: CityState = {
  city: null
}
