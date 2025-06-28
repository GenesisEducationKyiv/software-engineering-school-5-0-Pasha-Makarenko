import { AppState } from "../state.interfaces"
import { createSelector } from "@ngrx/store"

export const selectWeatherState = (state: AppState) => state.weather

export const selectWeather = createSelector(
  selectWeatherState,
  state => state.weather
)
