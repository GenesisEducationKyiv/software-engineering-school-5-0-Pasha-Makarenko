import { Module } from "@nestjs/common"
import { SendWeatherScheduler } from "../../application/scheduler/services/send-weather.scheduler"
import { NotificationsModule } from "./notifications.module"
import { SubscriptionsModule } from "./subscriptions.module"
import { CqrsModule } from "@nestjs/cqrs"
import { SendWeatherHandler } from "../../application/scheduler/commands/handlers/send-weather.handler"
import { WeatherModule } from "./weather.module"
import { InfrastructureModule } from "./infrastructure.module"
import { CleanUpSubscriptionsHandler } from "../../application/scheduler/commands/handlers/clean-up-subscriptions.handler"
import { CleanUpSubscriptionsScheduler } from "../../application/scheduler/services/clean-up-subscriptions.scheduler"

const commandHandlers = [SendWeatherHandler, CleanUpSubscriptionsHandler]

const schedulers = [SendWeatherScheduler, CleanUpSubscriptionsScheduler]

@Module({
  imports: [
    CqrsModule,
    NotificationsModule,
    SubscriptionsModule,
    InfrastructureModule,
    WeatherModule
  ],
  providers: [...commandHandlers, ...schedulers],
  exports: [...commandHandlers, ...schedulers]
})
export class SchedulerModule {}
