import { Test } from "@nestjs/testing"
import { HttpService } from "@nestjs/axios"
import { of } from "rxjs"
import { ConfigService } from "@nestjs/config"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Cache } from "cache-manager"
import { AxiosResponse } from "axios"
import { GetWeatherHandler } from "../../../../src/weather/queries/handlers/get-weather.handler"
import { GetWeatherQuery } from "../../../../src/weather/queries/impl/get-weather.query"
import { WeatherUrlGeneratorService } from "../../../../src/url-generator/services/weather-url-generator.service"
import {
  weatherUrlGeneratorServiceMockFactory,
  weatherUrlMock
} from "../../../mocks/services/weather-url-generator.service.mock"
import {
  configServiceMockFactory,
  WEATHER_API_KEY
} from "../../../mocks/services/config.service.mock"
import { weatherDataMock } from "../../../mocks/data/weather.mock"
import { httpServiceMockFactory } from "../../../mocks/services/http.service.mock"
import { cacheServiceMockFactory } from "../../../mocks/services/cache.service.mock"
import { weatherQueryDtoMock } from "../../../mocks/dto/weather-query.dto.mock"

describe("GetWeatherHandler", () => {
  let handler: GetWeatherHandler
  let httpService: HttpService
  let urlGeneratorService: WeatherUrlGeneratorService
  let cacheManager: Cache

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetWeatherHandler,
        {
          provide: HttpService,
          useValue: httpServiceMockFactory()
        },
        {
          provide: WeatherUrlGeneratorService,
          useValue: weatherUrlGeneratorServiceMockFactory()
        },
        {
          provide: ConfigService,
          useValue: configServiceMockFactory()
        },
        {
          provide: CACHE_MANAGER,
          useValue: cacheServiceMockFactory()
        }
      ]
    }).compile()

    handler = moduleRef.get<GetWeatherHandler>(GetWeatherHandler)
    httpService = moduleRef.get<HttpService>(HttpService)
    urlGeneratorService = moduleRef.get<WeatherUrlGeneratorService>(
      WeatherUrlGeneratorService
    )
    cacheManager = moduleRef.get(CACHE_MANAGER)
  })

  describe("execute", () => {
    it("should return weather data from API", async () => {
      const query = new GetWeatherQuery(weatherQueryDtoMock)
      const mockResponse = {
        data: weatherDataMock
      }

      jest
        .spyOn(httpService, "get")
        .mockReturnValue(of(mockResponse as AxiosResponse))

      const result = await handler.execute(query)

      expect(urlGeneratorService.weatherUrl).toHaveBeenCalledWith(
        weatherQueryDtoMock
      )
      expect(httpService.get).toHaveBeenCalledWith(weatherUrlMock, {
        params: {
          key: WEATHER_API_KEY,
          q: weatherQueryDtoMock.city,
          days: weatherQueryDtoMock.days,
          aqi: "no",
          alerts: "no"
        }
      })
      expect(result).toEqual(mockResponse.data)
    })

    it("should throw BadRequestException when API call fails", async () => {
      const query = new GetWeatherQuery(weatherQueryDtoMock)

      jest.spyOn(httpService, "get").mockImplementation(() => {
        throw new Error("API Error")
      })

      await expect(handler.execute(query)).rejects.toThrow("API Error")
    })

    it("should use cached data when available", async () => {
      const query = new GetWeatherQuery(weatherQueryDtoMock)

      const cachedData = weatherDataMock

      jest.spyOn(cacheManager, "get").mockResolvedValue(cachedData)

      const result = await handler.execute(query)

      expect(cacheManager.get).toHaveBeenCalledWith(
        `weather_${weatherQueryDtoMock.city}_${weatherQueryDtoMock.days}`
      )
      expect(result).toEqual(cachedData)
      expect(httpService.get).not.toHaveBeenCalled()
    })
  })
})
