import { Cache } from "cache-manager"
import { ConfigService } from "@nestjs/config"
import {
  BadRequestException,
  InternalServerErrorException
} from "@nestjs/common"
import * as util from "node:util"
import { Cacheable } from "../../../../src/shared/decorators/cacheable.decorator"
import { configServiceMockFactory } from "../../../mocks/services/config.service.mock"
import { cacheServiceMockFactory } from "../../../mocks/services/cache.service.mock"

class TestClass {
  cacheManager: Cache
  configService: ConfigService

  @Cacheable({ key: "static-key", ttl: 60 })
  async staticKeyMethod() {
    return "original-value"
  }

  @Cacheable({
    key: (arg: string) => `dynamic-key-${arg}`,
    ttl: config => config.get("CACHE_TTL")
  })
  async dynamicKeyMethod(arg: string) {
    return `original-${arg}`
  }

  @Cacheable({
    key: async (arg: string) => `async-key-${arg}`,
    ttl: async config => config.get("CACHE_TTL")
  })
  async asyncKeyMethod(arg: string) {
    return `original-${arg}`
  }

  @Cacheable({ key: "error-key" })
  async errorMethod() {
    throw new Error("Test error")
  }

  @Cacheable({ key: "no-cache-key" })
  async noCacheMethod() {
    return "no-cache-value"
  }
}

describe("Cacheable Decorator", () => {
  let mockCache: jest.Mocked<Cache>
  let mockConfigService: jest.Mocked<ConfigService>
  let testClass: TestClass

  beforeEach(() => {
    testClass = new TestClass()

    mockCache = cacheServiceMockFactory() as jest.Mocked<Cache>
    mockConfigService = configServiceMockFactory() as jest.Mocked<ConfigService>

    testClass.cacheManager = mockCache
    testClass.configService = mockConfigService
  })

  describe("static key and ttl", () => {
    it("should return cached value when available", async () => {
      mockCache.get.mockResolvedValue("cached-value")

      const result = await testClass.staticKeyMethod()

      expect(result).toBe("cached-value")
      expect(mockCache.get).toHaveBeenCalledWith("static-key")
      expect(mockCache.set).not.toHaveBeenCalled()
    })

    it("should call original method and cache result when no cache", async () => {
      mockCache.get.mockResolvedValue(null)
      mockCache.set.mockResolvedValue(null)

      const result = await testClass.staticKeyMethod()

      expect(result).toBe("original-value")
      expect(mockCache.get).toHaveBeenCalledWith("static-key")
      expect(mockCache.set).toHaveBeenCalledWith(
        "static-key",
        "original-value",
        60
      )
    })
  })

  describe("dynamic key and ttl", () => {
    it("should use dynamic key and ttl from config", async () => {
      mockCache.get.mockResolvedValue(null)
      mockConfigService.get.mockReturnValue(300)
      mockCache.set.mockResolvedValue(null)

      const result = await testClass.dynamicKeyMethod("test")

      expect(result).toBe("original-test")
      expect(mockCache.get).toHaveBeenCalledWith("dynamic-key-test")
      expect(mockConfigService.get).toHaveBeenCalledWith("CACHE_TTL")
      expect(mockCache.set).toHaveBeenCalledWith(
        "dynamic-key-test",
        "original-test",
        300
      )
    })
  })

  describe("async key and ttl", () => {
    it("should handle async key and ttl functions", async () => {
      mockCache.get.mockResolvedValue(null)
      mockConfigService.get.mockReturnValue(500)
      mockCache.set.mockResolvedValue(null)

      const result = await testClass.asyncKeyMethod("async")

      expect(result).toBe("original-async")
      expect(mockCache.get).toHaveBeenCalledWith("async-key-async")
      expect(mockConfigService.get).toHaveBeenCalledWith("CACHE_TTL")
      expect(mockCache.set).toHaveBeenCalledWith(
        "async-key-async",
        "original-async",
        500
      )
    })
  })

  describe("error handling", () => {
    it("should throw BadRequestException when original method throws", async () => {
      await expect(testClass.errorMethod()).rejects.toThrow(BadRequestException)
      await expect(testClass.errorMethod()).rejects.toThrow("Test error")
    })

    it("should throw InternalServerErrorException when cache manager is missing", async () => {
      testClass.cacheManager = undefined as never as Cache
      await expect(testClass.staticKeyMethod()).rejects.toThrow(
        InternalServerErrorException
      )
    })
  })

  describe("util.types.isAsyncFunction", () => {
    it("should correctly identify async functions", () => {
      const asyncFn = async () => null
      const syncFn = () => null

      expect(util.types.isAsyncFunction(asyncFn)).toBe(true)
      expect(util.types.isAsyncFunction(syncFn)).toBe(false)
    })
  })
})
