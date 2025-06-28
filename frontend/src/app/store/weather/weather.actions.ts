import { createAction, props } from "@ngrx/store"
import { WeatherState } from "./weather.state"

export const getWeatherAction = createAction("[Home] Get Weather")

export const getWeatherSuccessAction = createAction(
  "[Home] Get Weather Success",
  props<{ data: WeatherState["weather"]["data"] }>()
)

export const getWeatherFailureAction = createAction(
  "[Home] Get Weather Failure",
  props<{ error: WeatherState["weather"]["error"] }>()
)
