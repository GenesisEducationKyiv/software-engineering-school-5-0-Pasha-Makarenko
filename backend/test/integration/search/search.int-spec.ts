import { Test } from "@nestjs/testing"
import { BadRequestException, INestApplication } from "@nestjs/common"
import { AppModule } from "../../../src/app.module"
import { QueryBus } from "@nestjs/cqrs"
import { Cache } from "cache-manager"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { GetCitiesQuery } from "../../../src/search/queries/impl/get-cities.query"

describe("Search", () => {
  let app: INestApplication
  let queryBus: QueryBus
  let cacheManager: Cache
  const cityQuery = "Paris"

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

  describe("search", () => {
    it("should return cities for search query", async () => {
      const searchData = await queryBus.execute(new GetCitiesQuery(cityQuery))

      expect(Array.isArray(searchData)).toBe(true)
      expect(searchData.length).toBeGreaterThan(0)
    })

    it("should throw error for invalid query", async () => {
      await expect(
        queryBus.execute(new GetCitiesQuery(""))
      ).rejects.toThrowError(BadRequestException)
    })

    it("should return cached response for same query", async () => {
      const key = `search_${cityQuery}`

      await expect(cacheManager.get(key)).resolves.toBeNull()

      const searchData = await queryBus.execute(new GetCitiesQuery(cityQuery))

      await expect(cacheManager.get(key)).resolves.toEqual(searchData)
    })
  })
})
