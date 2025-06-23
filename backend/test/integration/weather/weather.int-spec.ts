import * as request from "supertest"
import { weatherQueryDtoMock } from "../../mocks/dto/weather-query.dto.mock"
import {
  beforeAllSetup,
  cleanupTestApp,
  setupTestApp,
  TestContext
} from "../setup"
import { HttpStatus } from "@nestjs/common"

describe("Weather", () => {
  let context: TestContext

  beforeAll(async () => {
    await beforeAllSetup()
  })

  beforeEach(async () => {
    context = await setupTestApp()
  })

  afterEach(async () => {
    await cleanupTestApp(context, { clearCache: true })
  })

  afterAll(async () => {
    await cleanupTestApp(context)
  })

  describe("weather", () => {
    it("should return weather data for a city", async () => {
      await request(context.app.getHttpServer())
        .get("/api/weather")
        .query(weatherQueryDtoMock)
        .expect(HttpStatus.OK)
        .expect(res => {
          expect(res.body?.location?.name).toBe(weatherQueryDtoMock.city)
        })
    })

    it("should throw error for invalid city", async () => {
      await request(context.app.getHttpServer())
        .get("/api/weather")
        .query({
          city: "invalid_city_query",
          lat: "invalid_lat",
          lon: "invalid_lon",
          days: weatherQueryDtoMock.days
        })
        .expect(HttpStatus.NOT_FOUND)
        .expect(res => {
          expect(res.body.message).toContain(
            `No cities found for "invalid_city_query"`
          )
          expect(res.body.statusCode).toBe(HttpStatus.NOT_FOUND)
        })
    })

    it("should return cached response for same query", async () => {
      const key = `weather:${weatherQueryDtoMock.city}:${weatherQueryDtoMock.days}`

      await expect(context.cacheManager.get(key)).resolves.toBeNull()

      const { body: weatherData } = await request(context.app.getHttpServer())
        .get("/api/weather")
        .query(weatherQueryDtoMock)
        .expect(HttpStatus.OK)

      await expect(context.cacheManager.get(key)).resolves.toEqual(weatherData)
    })
  })
})
