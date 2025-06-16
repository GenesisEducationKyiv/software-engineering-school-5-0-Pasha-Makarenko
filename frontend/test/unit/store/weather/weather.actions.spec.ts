import * as WeatherActions from "../../../../src/app/store/weather/weather.actions"
import { weatherDataMock } from "../../../mocks/data/weather.mock"

describe("Weather Actions", () => {
  const mockWeatherData = weatherDataMock

  it("should create getWeatherAction", () => {
    const action = WeatherActions.getWeatherAction()

    expect(action.type).toEqual("[Home] Get Weather")
  })

  it("should create getWeatherSuccessAction with data", () => {
    const action = WeatherActions.getWeatherSuccessAction({
      data: mockWeatherData
    })

    expect(action.type).toEqual("[Home] Get Weather Success")
    expect(action.data).toEqual(mockWeatherData)
  })

  it("should create getWeatherFailureAction with error", () => {
    const error = "Test error"
    const action = WeatherActions.getWeatherFailureAction({ error })

    expect(action.type).toEqual("[Home] Get Weather Failure")
    expect(action.error).toEqual(error)
  })
})
