import * as request from "supertest"
import {
  beforeAllSetup,
  cleanupTestApp,
  setupTestApp,
  TestContext
} from "../setup"
import { HttpStatus } from "@nestjs/common"

describe("Search", () => {
  let context: TestContext
  const cityQuery = "Paris"

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

  describe("search", () => {
    it("should return cities for search query", async () => {
      await request(context.app.getHttpServer())
        .get("/api/search")
        .query({ city: cityQuery })
        .expect(HttpStatus.OK)
        .expect(res => {
          expect(Array.isArray(res.body)).toBe(true)
          expect(res.body.length).toBeGreaterThan(0)
        })
    })

    it("should throw error for invalid query", async () => {
      await request(context.app.getHttpServer())
        .get("/api/search")
        .query({ city: "" })
        .expect(HttpStatus.BAD_REQUEST)
        .expect(res => {
          expect(res.body.message).toContain(
            `Request failed with status code ${HttpStatus.BAD_REQUEST}`
          )
          expect(res.body.statusCode).toBe(HttpStatus.BAD_REQUEST)
        })

      await request(context.app.getHttpServer())
        .get("/api/search")
        .query({ city: "invalid_city_query" })
        .expect(HttpStatus.OK)
        .expect(res => {
          expect(Array.isArray(res.body)).toBe(true)
          expect(res.body.length).toBe(0)
        })
    })

    it("should return cached response for same query", async () => {
      const key = `search_${cityQuery}`

      await expect(context.cacheManager.get(key)).resolves.toBeNull()

      const { body: searchData } = await request(context.app.getHttpServer())
        .get("/api/search")
        .query({ city: cityQuery })
        .expect(HttpStatus.OK)

      await expect(context.cacheManager.get(key)).resolves.toEqual(searchData)
    })
  })
})
