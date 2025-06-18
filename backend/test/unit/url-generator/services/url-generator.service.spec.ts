import { Test } from "@nestjs/testing"
import { ConfigService } from "@nestjs/config"
import { WeatherUrlGeneratorService } from "../../../../src/url-generator/services/weather-url-generator.service"
import { WeatherQueryDto } from "../../../../src/weather/dto/weather-query.dto"
import {
  configServiceMockFactory,
  WEATHER_API_KEY
} from "../../../mocks/services/config.service.mock"
import {
  searchUrlMock,
  weatherUrlMock
} from "../../../mocks/services/weather-url-generator.service.mock"
import {
  confirmUrlMock,
  unsubscribeUrlMock
} from "../../../mocks/services/client-url-generator.service.mock"
import { ClientUrlGeneratorService } from "../../../../src/url-generator/services/client-url-generator.service"

describe("UrlGeneratorService", () => {
  let weatherUrlGeneratorService: WeatherUrlGeneratorService
  let clientUrlGeneratorService: ClientUrlGeneratorService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        WeatherUrlGeneratorService,
        ClientUrlGeneratorService,
        {
          provide: ConfigService,
          useValue: configServiceMockFactory()
        }
      ]
    }).compile()

    weatherUrlGeneratorService = moduleRef.get<WeatherUrlGeneratorService>(
      WeatherUrlGeneratorService
    )
    clientUrlGeneratorService = moduleRef.get<ClientUrlGeneratorService>(
      ClientUrlGeneratorService
    )
  })

  describe("confirmUrl", () => {
    it("should generate correct confirmation URL", () => {
      const token = "test-token-123"
      const result = clientUrlGeneratorService.confirmUrl(token)

      expect(result.url).toBe(confirmUrlMock(token))
      expect(result.params).toEqual({})
    })
  })

  describe("unsubscribeUrl", () => {
    it("should generate correct unsubscribe URL", () => {
      const token = "unsubscribe-token-456"
      const result = clientUrlGeneratorService.unsubscribeUrl(token)

      expect(result.url).toBe(unsubscribeUrlMock(token))
      expect(result.params).toEqual({})
    })
  })

  describe("weatherUrl", () => {
    it("should generate correct weather API URL with params", () => {
      const dto: WeatherQueryDto = {
        city: "London",
        days: "3"
      }

      const result = weatherUrlGeneratorService.weatherUrl(dto)

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
      const result = weatherUrlGeneratorService.searchUrl(searchTerm)

      expect(result.url).toBe(searchUrlMock)
      expect(result.params).toEqual({
        key: WEATHER_API_KEY,
        q: "Lon"
      })
    })
  })
})
