import { TestBed } from "@angular/core/testing"
import { provideMockStore } from "@ngrx/store/testing"
import { WeatherAdapter } from "../../../../src/app/store/weather/weather.adapter"
import { WeatherService } from "../../../../src/app/api/weather/weather.service"
import { weatherServiceMockFactory } from "../../../mocks/services/weather.service.mock"
import * as WeatherActions from "../../../../src/app/store/weather/weather.actions"
import { throwError } from "rxjs"
import { Store } from "@ngrx/store"

describe("WeatherAdapter", () => {
  let adapter: WeatherAdapter
  let weatherService: jest.Mocked<WeatherService>

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        { provide: WeatherService, useValue: weatherServiceMockFactory() },
        WeatherAdapter
      ]
    })

    weatherService = TestBed.inject(
      WeatherService
    ) as jest.Mocked<WeatherService>
    adapter = TestBed.inject(WeatherAdapter)
  })

  it("should handle weather API errors", () => {
    weatherService.getWeather.mockReturnValue(
      throwError(() => new Error("API Error"))
    )
    const dispatchSpy = jest.spyOn(TestBed.inject(Store), "dispatch")

    adapter.weather("London", 51.5074, -0.1278)

    expect(dispatchSpy).toHaveBeenCalledWith(
      WeatherActions.getWeatherFailureAction({ error: "API Error" })
    )
  })
})
