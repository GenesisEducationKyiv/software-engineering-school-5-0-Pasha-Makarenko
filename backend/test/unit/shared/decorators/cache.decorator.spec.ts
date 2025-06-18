import { Cache } from "cache-manager"
import {
  BadRequestException,
  InternalServerErrorException
} from "@nestjs/common"
import { Cacheable } from "../../../../src/shared/decorators/cacheable.decorator"
import { cacheServiceMockFactory } from "../../../mocks/services/cache.service.mock"

class TestService {
  _cacheManager: Cache

  get cacheManager() {
    if (!this._cacheManager) {
      throw new InternalServerErrorException("Cache manager not initialized")
    }
    return this._cacheManager
  }

  set cacheManager(value: Cache) {
    this._cacheManager = value
  }

  @Cacheable({ key: "test-key", ttl: 60 })
  async cachedMethod() {
    return "result"
  }

  @Cacheable({ key: "error-key" })
  async errorMethod() {
    throw new Error("Test error")
  }
}

describe("Cacheable Decorator", () => {
  let service: TestService
  let cacheManager: jest.Mocked<Cache>

  beforeEach(() => {
    service = new TestService()
    cacheManager = cacheServiceMockFactory() as jest.Mocked<Cache>
    service.cacheManager = cacheManager
  })

  it("should return cached value", async () => {
    cacheManager.get.mockResolvedValue("cached-value")

    const result = await service.cachedMethod()

    expect(result).toBe("cached-value")
    expect(cacheManager.set).not.toHaveBeenCalled()
  })

  it("should call original method and cache result", async () => {
    cacheManager.get.mockResolvedValue(null)

    const result = await service.cachedMethod()

    expect(result).toBe("result")
    expect(cacheManager.set).toHaveBeenCalledWith("test-key", "result", 60)
  })

  it("should throw when original method fails", async () => {
    await expect(service.errorMethod()).rejects.toThrow(BadRequestException)
  })

  it("should throw when cache manager missing", async () => {
    jest
      .spyOn(service, "cacheManager", "get")
      .mockReturnValue(undefined as never as Cache)
    await expect(service.cachedMethod()).rejects.toThrow(
      InternalServerErrorException
    )
  })
})
