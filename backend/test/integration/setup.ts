import { Test } from "@nestjs/testing"
import { INestApplication, ValidationPipe } from "@nestjs/common"
import { Cache } from "cache-manager"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { QueryBus } from "@nestjs/cqrs"
import { AppModule } from "../../src/main/app.module"
import { server } from "../mocks/server.mock"
import { MikroORM } from "@mikro-orm/core"
import { InvalidDataException } from "../../src/application/common/exceptions/invalid-data.exception"
import { GlobalExceptionFilter } from "../../src/presentation/common/filters/global.exception.filter"
import { exceptionFilters } from "../../src/presentation/common/filters/exception.filters"

export interface ClearOptions {
  clearCache?: boolean
  clearDB?: boolean
}

export interface CloseOptions {
  closeDB?: boolean
}

export interface TestContext {
  app: INestApplication
  orm: MikroORM
  cacheManager: Cache
  queryBus: QueryBus
}

export async function beforeAllSetup() {
  server.listen({
    onUnhandledRequest: "bypass"
  })
}

export async function setupTestApp(): Promise<TestContext> {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule]
  }).compile()

  const app = moduleFixture.createNestApplication()
  app.setGlobalPrefix("api")
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: errors => {
        return new InvalidDataException(
          JSON.stringify(
            errors.map(error => ({
              property: error.property,
              constraints: error.constraints
            }))
          )
        )
      }
    })
  )
  app.useGlobalFilters(new GlobalExceptionFilter(exceptionFilters))
  await app.init()

  const cacheManager = moduleFixture.get<Cache>(CACHE_MANAGER)
  const queryBus = moduleFixture.get<QueryBus>(QueryBus)
  const orm = moduleFixture.get<MikroORM>(MikroORM)

  await orm.schema.dropSchema()
  await orm.schema.createSchema()

  return { app, orm, cacheManager, queryBus }
}

export async function cleanupTestApp(
  context: TestContext,
  options: ClearOptions = {}
) {
  server.resetHandlers()
  if (options?.clearCache) {
    await context.cacheManager.clear()
  }
  if (options?.clearDB) {
    await context.orm.schema.clearDatabase()
  }
}

export async function closeTestApp(
  context: TestContext,
  options: CloseOptions = {}
) {
  server.close()
  await context.app.close()
  if (options?.closeDB) {
    await context.orm.close(true)
  }
}
