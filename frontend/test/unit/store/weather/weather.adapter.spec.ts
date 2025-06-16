import { TestBed } from "@angular/core/testing"
import { Store } from "@ngrx/store"
import { provideMockStore } from "@ngrx/store/testing"
import { of, throwError } from "rxjs"
import * as WeatherActions from "../../../../src/app/store/weather/weather.actions"
import { WeatherAdapter } from "../../../../src/app/store/weather/weather.adapter"
import { WeatherService } from "../../../../src/app/api/weather/weather.service"
import { weatherServiceMockFactory } from "../../../mocks/services/weather.service.mock"
import {
  weatherDataMock,
  weatherStateMock
} from "../../../mocks/data/weather.mock"

describe("WeatherAdapter", () => {
  let adapter: WeatherAdapter
  let store: Store
  let weatherService: jest.Mocked<WeatherService>

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        {
          provide: WeatherService,
          useValue: weatherServiceMockFactory()
        },
        WeatherAdapter
      ]
    })

    store = TestBed.inject(Store)
    weatherService = TestBed.inject(
      WeatherService
    ) as jest.Mocked<WeatherService>
    adapter = TestBed.inject(WeatherAdapter)
  })

  describe("select", () => {
    it("should select weather from store", () => {
      const mockWeather = weatherStateMock.weather

      jest.spyOn(store, "select").mockReturnValue(of(mockWeather))

      let result
      adapter.select().subscribe(weather => (result = weather))

      expect(store.select).toHaveBeenCalledWith(expect.any(Function)) // selectWeather selector
      expect(result).toEqual(mockWeather)
    })
  })

  describe("weather", () => {
    const mockWeatherData = weatherDataMock
    const city = mockWeatherData.location.name
    const mockFinallyFn = jest.fn()

    it("should not dispatch actions if city is null", () => {
      const dispatchSpy = jest.spyOn(store, "dispatch")

      adapter.weather(null)

      expect(dispatchSpy).not.toHaveBeenCalled()
      expect(weatherService.getWeather).not.toHaveBeenCalled()
    })

    it("should dispatch getWeatherAction when city is provided", () => {
      weatherService.getWeather.mockReturnValue(of(mockWeatherData))
      const dispatchSpy = jest.spyOn(store, "dispatch")

      adapter.weather(city)

      expect(dispatchSpy).toHaveBeenCalledWith(
        WeatherActions.getWeatherAction()
      )
    })

    it("should call weatherService with correct parameters", () => {
      weatherService.getWeather.mockReturnValue(of(mockWeatherData))

      adapter.weather(city)

      expect(weatherService.getWeather).toHaveBeenCalledWith({
        city,
        days: 14
      })
    })

    it("should dispatch success action on successful API call", () => {
      weatherService.getWeather.mockReturnValue(of(mockWeatherData))
      const dispatchSpy = jest.spyOn(store, "dispatch")

      adapter.weather(city)

      expect(dispatchSpy).toHaveBeenCalledWith(
        WeatherActions.getWeatherSuccessAction({ data: mockWeatherData })
      )
    })

    it("should dispatch failure action on API error", () => {
      const error = new Error("API Error")
      weatherService.getWeather.mockReturnValue(throwError(() => error))
      const dispatchSpy = jest.spyOn(store, "dispatch")

      adapter.weather(city)

      expect(dispatchSpy).toHaveBeenCalledWith(
        WeatherActions.getWeatherFailureAction({ error: error.message })
      )
    })

    it("should dispatch failure with default error message when error has no message", () => {
      weatherService.getWeather.mockReturnValue(throwError(() => ({})))
      const dispatchSpy = jest.spyOn(store, "dispatch")

      adapter.weather(city)

      expect(dispatchSpy).toHaveBeenCalledWith(
        WeatherActions.getWeatherFailureAction({
          error: "Something went wrong"
        })
      )
    })

    it("should call finallyFn when provided", () => {
      weatherService.getWeather.mockReturnValue(of(mockWeatherData))

      adapter.weather(city, mockFinallyFn)

      expect(mockFinallyFn).toHaveBeenCalled()
    })
  })
})
