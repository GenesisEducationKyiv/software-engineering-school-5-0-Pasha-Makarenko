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
import { MailModule } from "./modules/mail.module"
import { WeatherModule } from "./modules/weather.module"
import { CacheModule } from "@nestjs/cache-manager"
import { getCacheConfig } from "./config/cache.config"
import { ScheduleModule } from "@nestjs/schedule"
import { SearchModule } from "./modules/search.module"
import { dynamicServeStatic } from "./config/serve-static.config"
import { SchedulerModule } from "./modules/scheduler.module"
import { UrlGeneratorModule } from "./modules/url-generator.module"
import { MetricsMiddleware } from "../presentation/common/middlewares/metrics.middleware"
import { MetricsModule } from "./modules/metrics.module"
import { LoggerModule } from "nestjs-pino"
import { getPinoConfig } from "./config/logger.config"
import { TransactionsModule } from "./modules/transactions.module"
import { PostgreSqlDriver } from "@mikro-orm/postgresql"

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
    TransactionsModule,
    MailModule,
    SubscriptionsModule,
    WeatherModule,
    SearchModule,
    SchedulerModule,
    UrlGeneratorModule
  ],
  exports: [ConfigModule]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MetricsMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL })
  }
}
