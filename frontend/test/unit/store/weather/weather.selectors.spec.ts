import {
  selectWeather,
  selectWeatherState
} from "../../../../src/app/store/weather/weather.selectors"
import { appStateMock } from "../../../mocks/common/state.mock"

describe("Weather Selectors", () => {
  const initialState = appStateMock

  it("should select the weather state", () => {
    const result = selectWeatherState(initialState)
    expect(result).toEqual(initialState.weather)
  })

  it("should select the weather data", () => {
    const result = selectWeather.projector(initialState.weather)
    expect(result).toEqual(initialState.weather.weather)
  })
})
