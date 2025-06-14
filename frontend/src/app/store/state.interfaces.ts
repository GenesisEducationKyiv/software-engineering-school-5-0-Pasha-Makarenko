import { ModalState } from "./modal/modal.state"
import { WeatherState } from "./weather/weather.state"
import { CityState } from "./city/city.state"

export interface StateItem<T = null> {
  data: T | null
  isLoading: boolean
  error: string | null
}

export interface AppState {
  modals: ModalState
  weather: WeatherState
  city: CityState
}
