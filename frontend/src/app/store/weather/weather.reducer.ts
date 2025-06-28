import { createReducer, on } from "@ngrx/store"
import { initialWeatherState } from "./weather.state"
import * as WeatherActions from "./weather.actions"

export const weatherReducer = createReducer(
  initialWeatherState,
  on(WeatherActions.getWeatherAction, state => ({
    ...state,
    weather: {
      data: null,
      error: null,
      isLoading: true
    }
  })),
  on(WeatherActions.getWeatherSuccessAction, (state, { data }) => ({
    ...state,
    weather: {
      data,
      error: null,
      isLoading: false
    }
  })),
  on(WeatherActions.getWeatherFailureAction, (state, { error }) => ({
    ...state,
    weather: {
      data: null,
      error,
      isLoading: false
    }
  }))
)
