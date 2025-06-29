import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { SequelizeModule } from "@nestjs/sequelize"
import { getSequelizeConfig } from "./config/database.config"
import { config } from "./config/config"
import { SubscriptionsModule } from "./subscriptions/subscriptions.module"
import { MailModule } from "./mail/mail.module"
import { WeatherModule } from "./weather/weather.module"
import { CacheModule } from "@nestjs/cache-manager"
import { getCacheConfig } from "./config/cache.config"
import { ScheduleModule } from "@nestjs/schedule"
import { SearchModule } from "./search/search.module"
import { dynamicServeStatic } from "./config/serve-static.config"
import { SchedulerModule } from "./scheduler/scheduler.module"
import { UrlGeneratorModule } from "./url-generator/url-generator.module"
import { MetricsMiddleware } from "./metrics/middlewares/metrics.middleware"
import { MetricsModule } from "./metrics/metrics.module"

@Module({
  imports: [
    ConfigModule.forRoot(config),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getSequelizeConfig,
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
