import { of } from "rxjs"
import { initialWeatherState } from "../../../src/app/store/weather/weather.state"
import { WeatherAdapter } from "../../../src/app/store/weather/weather.adapter"

export const weatherAdapterMockFactory = () =>
  ({
    select: jest.fn(() => of(initialWeatherState.weather)),
    weather: jest.fn()
  }) as never as WeatherAdapter
