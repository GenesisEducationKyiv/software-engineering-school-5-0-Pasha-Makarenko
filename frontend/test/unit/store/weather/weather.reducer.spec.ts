import { Action } from "@ngrx/store"
import * as WeatherActions from "../../../../src/app/store/weather/weather.actions"
import { weatherReducer } from "../../../../src/app/store/weather/weather.reducer"
import { initialWeatherState } from "../../../../src/app/store/weather/weather.state"
import { weatherDataMock } from "../../../mocks/data/weather.mock"

describe("Weather Reducer", () => {
  const mockWeatherData = weatherDataMock

  describe("initial state", () => {
    it("should return the initial state", () => {
      const action = {} as Action
      const state = weatherReducer(undefined, action)

      expect(state).toEqual(initialWeatherState)
    })
  })

  describe("getWeatherAction", () => {
    it("should set isLoading to true and clear data and error", () => {
      const initialStateWithError = {
        weather: {
          data: null,
          isLoading: false,
          error: "Previous error"
        }
      }
      const action = WeatherActions.getWeatherAction()
      const state = weatherReducer(initialStateWithError, action)

      expect(state.weather).toEqual({
        data: null,
        isLoading: true,
        error: null
      })
    })
  })

  describe("getWeatherSuccessAction", () => {
    it("should set data and set isLoading to false", () => {
      const initialStateLoading = {
        weather: {
          data: null,
          isLoading: true,
          error: null
        }
      }
      const action = WeatherActions.getWeatherSuccessAction({
        data: mockWeatherData
      })
      const state = weatherReducer(initialStateLoading, action)

      expect(state.weather).toEqual({
        data: mockWeatherData,
        isLoading: false,
        error: null
      })
    })
  })

  describe("getWeatherFailureAction", () => {
    it("should set error and set isLoading to false", () => {
      const initialStateLoading = {
        weather: {
          data: null,
          isLoading: true,
          error: null
        }
      }
      const errorMessage = "Failed to load weather"
      const action = WeatherActions.getWeatherFailureAction({
        error: errorMessage
      })
      const state = weatherReducer(initialStateLoading, action)

      expect(state.weather).toEqual({
        data: null,
        isLoading: false,
        error: errorMessage
      })
    })
  })
})
