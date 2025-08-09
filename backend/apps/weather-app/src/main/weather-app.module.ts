import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { MikroOrmModule } from "@mikro-orm/nestjs"
import { getMikroOrmConfig } from "./config/database.config"
import { config } from "./config/config"
import { SubscriptionsModule } from "./modules/subscriptions.module"
import { NotificationsModule } from "./modules/notifications.module"
import { WeatherModule } from "./modules/weather.module"
import { CacheModule } from "@nestjs/cache-manager"
import { getCacheConfig } from "./config/cache.config"
import { ScheduleModule } from "@nestjs/schedule"
import { SearchModule } from "./modules/search.module"
import { dynamicServeStatic } from "./config/serve-static.config"
import { SchedulerModule } from "./modules/scheduler.module"
import { MetricsMiddleware } from "../presentation/common/middlewares/metrics.middleware"
import { MetricsModule } from "./modules/metrics.module"
import { LoggerModule } from "nestjs-pino"
import { getPinoConfig } from "./config/logger.config"
import { InfrastructureModule } from "./modules/infrastructure.module"
import { PostgreSqlDriver } from "@mikro-orm/postgresql"
import { RequestIdMiddleware } from "../presentation/common/middlewares/request-id.middleware"

@Module({
  imports: [
    ConfigModule.forRoot(config),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getMikroOrmConfig,
      driver: PostgreSqlDriver,
      inject: [ConfigService]
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: getCacheConfig,
      inject: [ConfigService]
    }),
    ScheduleModule.forRoot(),
    ...dynamicServeStatic(),
    MetricsModule,
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getPinoConfig,
      inject: [ConfigService]
    }),
    InfrastructureModule,
    NotificationsModule,
    SubscriptionsModule,
    WeatherModule,
    SearchModule,
    SchedulerModule
  ],
  exports: [ConfigModule]
})
export class WeatherAppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware, MetricsMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL })
  }
}
