import { Test } from "@nestjs/testing"
import { ConfigService } from "@nestjs/config"
import { UrlGeneratorService } from "../../../../src/url-generator/services/url-generator.service"
import { WeatherQueryDto } from "../../../../src/weather/dto/weather-query.dto"
import {
  configServiceMockFactory,
  WEATHER_API_KEY
} from "../../../mocks/services/config.service.mock"
import {
  confirmUrlMock,
  searchUrlMock,
  unsubscribeUrlMock,
  weatherUrlMock
} from "../../../mocks/services/url-generator.service.mock"

describe("UrlGeneratorService", () => {
  let service: UrlGeneratorService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UrlGeneratorService,
        {
          provide: ConfigService,
          useValue: configServiceMockFactory()
        }
      ]
    }).compile()

    service = moduleRef.get<UrlGeneratorService>(UrlGeneratorService)
  })

  describe("confirmUrl", () => {
    it("should generate correct confirmation URL", () => {
      const token = "test-token-123"
      const result = service.confirmUrl(token)

      expect(result.url).toBe(`${confirmUrlMock}test-token-123`)
      expect(result.params).toEqual({})
    })
  })

  describe("unsubscribeUrl", () => {
    it("should generate correct unsubscribe URL", () => {
      const token = "unsubscribe-token-456"
      const result = service.unsubscribeUrl(token)

      expect(result.url).toBe(`${unsubscribeUrlMock}unsubscribe-token-456`)
      expect(result.params).toEqual({})
    })
  })

  describe("weatherUrl", () => {
    it("should generate correct weather API URL with params", () => {
      const dto: WeatherQueryDto = {
        city: "London",
        days: "3"
      }

      const result = service.weatherUrl(dto)

      expect(result.url).toBe(weatherUrlMock)
      expect(result.params).toEqual({
        key: WEATHER_API_KEY,
        q: "London",
        days: "3",
        aqi: "no",
        alerts: "no"
      })
    })
  })

  describe("searchUrl", () => {
    it("should generate correct search API URL with params", () => {
      const searchTerm = "Lon"
      const result = service.searchUrl(searchTerm)

      expect(result.url).toBe(searchUrlMock)
      expect(result.params).toEqual({
        key: WEATHER_API_KEY,
        q: "Lon"
      })
    })
  })
})
