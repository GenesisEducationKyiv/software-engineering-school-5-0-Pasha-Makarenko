import { Test } from "@nestjs/testing"
import { BadRequestException, INestApplication } from "@nestjs/common"
import { AppModule } from "../../../src/app.module"
import { QueryBus } from "@nestjs/cqrs"
import { GetWeatherQuery } from "../../../src/weather/queries/impl/get-weather.query"
import { weatherQueryDtoMock } from "../../mocks/dto/weather-query.dto.mock"
import { Cache } from "cache-manager"
import { CACHE_MANAGER } from "@nestjs/cache-manager"

describe("Weather", () => {
  let app: INestApplication
  let queryBus: QueryBus
  let cacheManager: Cache

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    queryBus = moduleFixture.get<QueryBus>(QueryBus)
    cacheManager = moduleFixture.get<Cache>(CACHE_MANAGER)
  })

  afterEach(async () => {
    await cacheManager.clear()
  })

  afterAll(async () => {
    await app.close()
  })

  describe("weather", () => {
    it("should return weather data for a city", async () => {
      const weatherData = await queryBus.execute(
        new GetWeatherQuery(weatherQueryDtoMock)
      )

      expect(weatherData.location.name).toBe(weatherQueryDtoMock.city)
    })

    it("should throw error for invalid city", async () => {
      await expect(
        queryBus.execute(
          new GetWeatherQuery({
            city: "",
            days: ""
          })
        )
      ).rejects.toThrowError(BadRequestException)
    })

    it("should return cached response for same query", async () => {
      const key = `weather_${weatherQueryDtoMock.city}_${weatherQueryDtoMock.days}`

      await expect(cacheManager.get(key)).resolves.toBeNull()

      const weatherData = await queryBus.execute(
        new GetWeatherQuery(weatherQueryDtoMock)
      )

      await expect(cacheManager.get(key)).resolves.toEqual(weatherData)
    })
  })
})
