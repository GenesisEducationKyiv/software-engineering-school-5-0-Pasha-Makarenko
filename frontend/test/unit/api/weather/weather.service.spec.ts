import { TestBed } from "@angular/core/testing"
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing"
import { WeatherService } from "../../../../src/app/api/weather/weather.service"
import { CookieService } from "ngx-cookie-service"
import { ENDPOINTS } from "../../../../src/app/consts/endpoints"
import { cookieServiceMockFactory } from "../../../mocks/services/cookie.service.mock"

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

  it("should handle weather API errors", () => {
    const dto = {
      city: "London",
      lat: 51.5074,
      lon: -0.1278,
      days: 3
    }
    const errorResponse = { status: 404, statusText: "Not Found" }

    service.getWeather(dto).subscribe({
      error: err => {
        expect(err.status).toBe(404)
      }
    })

    const req = httpMock.expectOne(ENDPOINTS.weather(dto))
    req.flush(null, errorResponse)
  })
})
