import { TestBed } from "@angular/core/testing"
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing"
import { WeatherService } from "../../../../src/app/api/weather/weather.service"
import { CookieService } from "ngx-cookie-service"
import { ENDPOINTS } from "../../../../src/app/consts/endpoints"
import { cookieServiceMockFactory } from "../../../mocks/services/cookie.service.mock"
import { weatherDataMock } from "../../../mocks/data/weather.mock"

describe("WeatherService", () => {
  let service: WeatherService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        WeatherService,
        { provide: CookieService, useValue: cookieServiceMockFactory() }
      ]
    })

    service = TestBed.inject(WeatherService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it("should be created", () => {
    expect(service).toBeTruthy()
  })

  it("should get weather data", () => {
    const mockData = weatherDataMock
    const city = mockData.location.name
    const days = mockData.forecast.forecastday.length

    service.getWeather({ city, days }).subscribe(data => {
      expect(data).toEqual(mockData)
    })

    const req = httpMock.expectOne(ENDPOINTS.weather(city, days))
    expect(req.request.method).toBe("GET")
    req.flush(mockData)
  })
})
