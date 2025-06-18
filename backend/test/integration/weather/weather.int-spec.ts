import * as request from "supertest"
import { weatherQueryDtoMock } from "../../mocks/dto/weather-query.dto.mock"
import {
  beforeAllSetup,
  cleanupTestApp,
  setupTestApp,
  TestContext
} from "../setup"

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
        .query({
          city: weatherQueryDtoMock.city,
          days: weatherQueryDtoMock.days
        })
        .expect(200)
        .expect(res => {
          expect(res.body?.location?.name).toBe(weatherQueryDtoMock.city)
        })
    })

    it("should throw error for invalid city", async () => {
      await request(context.app.getHttpServer())
        .get("/api/weather")
        .query({
          city: "invalid_city_query",
          days: weatherQueryDtoMock.days
        })
        .expect(400)
        .expect(res => {
          expect(res.body.message).toContain(
            "Request failed with status code 400"
          )
          expect(res.body.statusCode).toBe(400)
        })
    })

    it("should return cached response for same query", async () => {
      const key = `weather_${weatherQueryDtoMock.city}_${weatherQueryDtoMock.days}`

      await expect(context.cacheManager.get(key)).resolves.toBeNull()

      const { body: weatherData } = await request(context.app.getHttpServer())
        .get("/api/weather")
        .query({
          city: weatherQueryDtoMock.city,
          days: weatherQueryDtoMock.days
        })
        .expect(200)

      await expect(context.cacheManager.get(key)).resolves.toEqual(weatherData)
    })
  })
})
