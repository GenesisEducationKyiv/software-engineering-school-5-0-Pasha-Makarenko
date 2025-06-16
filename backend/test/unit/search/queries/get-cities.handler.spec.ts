import { Test } from "@nestjs/testing"
import { HttpService } from "@nestjs/axios"
import { ConfigService } from "@nestjs/config"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Cache } from "cache-manager"
import { of } from "rxjs"
import { BadRequestException } from "@nestjs/common"
import { UrlGeneratorService } from "../../../../src/url-generator/services/url-generator.service"
import { GetCitiesHandler } from "../../../../src/search/queries/handlers/get-cities.handler"
import { GetCitiesQuery } from "../../../../src/search/queries/impl/get-cities.query"
import { City } from "../../../../src/search/interfaces/search.interface"
import { AxiosResponse } from "axios"
import { httpServiceMockFactory } from "../../../mocks/services/http.service.mock"
import {
  searchUrlMock,
  urlGeneratorServiceMockFactory
} from "../../../mocks/services/url-generator.service.mock"
import { configServiceMockFactory } from "../../../mocks/services/config.service.mock"
import { cacheServiceMockFactory } from "../../../mocks/services/cache.service.mock"

describe("GetCitiesHandler", () => {
  let handler: GetCitiesHandler
  let httpService: HttpService
  let urlGeneratorService: UrlGeneratorService
  let configService: ConfigService
  let cacheManager: Cache

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetCitiesHandler,
        {
          provide: HttpService,
          useValue: httpServiceMockFactory()
        },
        {
          provide: UrlGeneratorService,
          useValue: urlGeneratorServiceMockFactory()
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

    handler = moduleRef.get<GetCitiesHandler>(GetCitiesHandler)
    httpService = moduleRef.get<HttpService>(HttpService)
    urlGeneratorService =
      moduleRef.get<UrlGeneratorService>(UrlGeneratorService)
    configService = moduleRef.get<ConfigService>(ConfigService)
    cacheManager = moduleRef.get<Cache>(CACHE_MANAGER)
  })

  describe("execute", () => {
    it("should return cities from API when not cached", async () => {
      const city = "London"
      const query = new GetCitiesQuery(city)
      const mockParams = { q: city }
      const mockResponse = {
        data: [
          { id: 1, name: "London" },
          { id: 2, name: "Londonville" }
        ]
      } as never as AxiosResponse<City[]>

      jest.spyOn(httpService, "get").mockReturnValue(of(mockResponse))
      jest.spyOn(cacheManager, "get").mockResolvedValue(null)
      jest.spyOn(configService, "get").mockReturnValue(300)

      const result = await handler.execute(query)

      expect(urlGeneratorService.searchUrl).toHaveBeenCalledWith(city)
      expect(httpService.get).toHaveBeenCalledWith(searchUrlMock, {
        params: mockParams
      })
      expect(result).toEqual(mockResponse.data)
    })

    it("should return cached cities when available", async () => {
      const city = "London"
      const query = new GetCitiesQuery(city)
      const cachedData = [
        { id: 1, name: "London" },
        { id: 2, name: "Londonville" }
      ] as never as City[]

      jest.spyOn(cacheManager, "get").mockResolvedValue(cachedData)
      jest.spyOn(configService, "get").mockReturnValue(300)

      const result = await handler.execute(query)

      expect(cacheManager.get).toHaveBeenCalledWith(`search_${city}`)
      expect(result).toEqual(cachedData)
      expect(httpService.get).not.toHaveBeenCalled()
    })

    it("should throw BadRequestException when API call fails", async () => {
      const city = "London"
      const query = new GetCitiesQuery(city)

      jest.spyOn(httpService, "get").mockImplementation(() => {
        throw new Error("API Error")
      })

      await expect(handler.execute(query)).rejects.toThrow(BadRequestException)
    })

    it("should handle empty city parameter", async () => {
      const city = ""
      const query = new GetCitiesQuery(city)
      const mockResponse = { data: [] } as never as AxiosResponse<City[]>

      jest.spyOn(httpService, "get").mockReturnValue(of(mockResponse))

      const result = await handler.execute(query)

      expect(result).toEqual([])
    })
  })
})
