import { Module } from "@nestjs/common"
import { SchedulerService } from "../../infrastructure/scheduler/services/scheduler.service"
import { NotificationsModule } from "./notifications.module"
import { SubscriptionsModule } from "./subscriptions.module"
import { CqrsModule } from "@nestjs/cqrs"
import { SendWeatherHandler } from "../../application/scheduler/commands/handlers/send-weather.handler"
import { WeatherModule } from "./weather.module"
import { InfrastructureModule } from "./infrastructure.module"

const commandHandlers = [SendWeatherHandler]

@Module({
  imports: [
    CqrsModule,
    NotificationsModule,
    SubscriptionsModule,
    InfrastructureModule,
    WeatherModule
  ],
  providers: [SchedulerService, ...commandHandlers],
  exports: [SchedulerService, ...commandHandlers]
})
export class SchedulerModule {}
