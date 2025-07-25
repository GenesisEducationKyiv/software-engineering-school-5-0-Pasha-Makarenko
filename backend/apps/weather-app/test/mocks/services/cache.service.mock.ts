import { Cache } from "@nestjs/cache-manager"

export const cacheServiceMockFactory = () =>
  ({
    get: jest.fn(),
    set: jest.fn()
  }) as never as Cache
