import { Cache } from "cache-manager"
import {
  BadRequestException,
  InternalServerErrorException
} from "@nestjs/common"
import * as util from "node:util"
import { ConfigService } from "@nestjs/config"

export type CacheKeyFunction =
  | ((...args: unknown[]) => string | number | Promise<string | number>)
  | string
  | number
export type TTLFunction = (
  configService: ConfigService
) => number | string | undefined | Promise<number | string | undefined>

export interface CacheableOptions {
  key: CacheKeyFunction
  ttl?: number | string | TTLFunction
}

export const Cacheable = (options: CacheableOptions) => {
  return function (
    _target: unknown,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: unknown[]) {
      const cache: Cache = this.cacheManager
      const configService: ConfigService = this.configService

      if (!cache) {
        throw new InternalServerErrorException("Cache manager is not available")
      }

      try {
        const cacheKey = String(
          typeof options.key === "function"
            ? util.types.isAsyncFunction(options.key)
              ? await options.key(...args)
              : options.key(...args)
            : options.key
        )

        const cachedValue = await cache.get(cacheKey)

        if (cachedValue) {
          return cachedValue
        }

        const value = await originalMethod.apply(this, args)

        const ttl = Number(
          typeof options.ttl === "function"
            ? util.types.isAsyncFunction(options.ttl)
              ? await options.ttl(configService)
              : options.ttl(configService)
            : options.ttl
        )

        await cache.set(cacheKey, value, ttl)

        return value
      } catch (error) {
        throw new BadRequestException(error.message)
      }
    }

    return descriptor
  }
}
