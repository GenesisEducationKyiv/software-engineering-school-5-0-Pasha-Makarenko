import { WeatherData } from "../../api/weather/weather.interface"
import { StateItem } from "../state.interfaces"

export interface WeatherState {
  weather: StateItem<WeatherData>
}

export const initialWeatherState: WeatherState = {
  weather: {
    data: null,
    isLoading: false,
    error: null
  }
}
