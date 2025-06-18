import { Test } from "@nestjs/testing"
import { INestApplication, ValidationPipe } from "@nestjs/common"
import { Sequelize } from "sequelize-typescript"
import { getModelToken } from "@nestjs/sequelize"
import { Cache } from "cache-manager"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { QueryBus } from "@nestjs/cqrs"
import { AppModule } from "../../src/app.module"
import { Subscription } from "../../src/subscriptions/models/subscription.model"
import { server } from "../mocks/server.mock"

export interface ClearOptions {
  clearCache?: boolean
  clearDB?: boolean
}

export interface CloseOptions {
  closeDB?: boolean
}

export interface TestContext {
  app: INestApplication
  sequelize: Sequelize
  subscriptionModel: typeof Subscription
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
      transform: true
    })
  )
  await app.init()

  const sequelize = moduleFixture.get<Sequelize>(Sequelize)
  const subscriptionModel = moduleFixture.get<typeof Subscription>(
    getModelToken(Subscription)
  )
  const cacheManager = moduleFixture.get<Cache>(CACHE_MANAGER)
  const queryBus = moduleFixture.get<QueryBus>(QueryBus)

  return { app, sequelize, subscriptionModel, cacheManager, queryBus }
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
    await context.subscriptionModel.destroy({ where: {} })
  }
}

export async function closeTestApp(
  context: TestContext,
  options: CloseOptions = {}
) {
  server.close()
  await context.app.close()
  if (options?.closeDB) {
    await context.sequelize.close()
  }
}
