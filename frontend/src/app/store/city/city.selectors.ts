import { createSelector } from "@ngrx/store"
import { AppState } from "../state.interfaces"

export const selectCityState = (state: AppState) => state.city

export const selectCity = createSelector(selectCityState, state => state.city)
