import { createReducer, on } from "@ngrx/store"
import { initialCityState } from "./city.state"
import * as CityActions from "./city.actions"

export const cityReducer = createReducer(
  initialCityState,
  on(CityActions.setCity, (state, { city }) => ({
    ...state,
    city
  }))
)
