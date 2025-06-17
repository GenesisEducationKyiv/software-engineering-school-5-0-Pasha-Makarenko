import { Module } from "@nestjs/common"
import { SchedulerService } from "./services/scheduler.service"
import { MailModule } from "../mail/mail.module"
import { SubscriptionsModule } from "../subscriptions/subscriptions.module"
import { CqrsModule } from "@nestjs/cqrs"
import { UrlGeneratorModule } from "../url-generator/url-generator.module"
import { SendWeatherHandler } from "./commands/handlers/send-weather.handler"
import { WeatherModule } from "../weather/weather.module"

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
