import { Module } from "@nestjs/common"
import { SchedulerService } from "../../infrastructure/scheduler/services/scheduler.service"
import { MailModule } from "./mail.module"
import { SubscriptionsModule } from "./subscriptions.module"
import { CqrsModule } from "@nestjs/cqrs"
import { UrlGeneratorModule } from "./url-generator.module"
import { SendWeatherHandler } from "../../application/scheduler/commands/handlers/send-weather.handler"
import { WeatherModule } from "./weather.module"

const commandHandlers = [SendWeatherHandler]

@Module({
  imports: [
    CqrsModule,
    MailModule,
    SubscriptionsModule,
    WeatherModule,
    UrlGeneratorModule
  ],
  providers: [SchedulerService, ...commandHandlers],
  exports: [SchedulerService, ...commandHandlers]
})
export class SchedulerModule {}
