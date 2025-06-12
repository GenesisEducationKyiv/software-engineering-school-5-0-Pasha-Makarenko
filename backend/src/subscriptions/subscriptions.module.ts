import { Module } from "@nestjs/common"
import { SequelizeModule } from "@nestjs/sequelize"
import { SubscriptionsService } from "./subscriptions.service"
import { Subscription } from "./subscription.model"
import { SubscriptionsController } from "./subscriptions.controller"
import { MailModule } from "../mail/mail.module"
import { ConfigModule } from "@nestjs/config"
import { CqrsModule } from "@nestjs/cqrs"
import { CreateSubscriptionHandler } from "./commands/handlers/create-subscription.handler"
import { UnsubscribeHandler } from "./commands/handlers/unsubscribe.handler"
import { ConfirmSubscriptionHandler } from "./commands/handlers/confirm-subscription.handler"
import { GetActiveSubscriptionsHandler } from "./queries/handlers/get-active-subscriptions.handler"
import { SubscriptionCreatedHandler } from "./events/handlers/subscription-created.handler"
import { UrlGeneratorModule } from "../url-generator/url-generator.module"

const commandHandlers = [
  CreateSubscriptionHandler,
  ConfirmSubscriptionHandler,
  UnsubscribeHandler
]

const queryHandlers = [GetActiveSubscriptionsHandler]

const eventHandlers = [SubscriptionCreatedHandler]

@Module({
  controllers: [SubscriptionsController],
  providers: [
    SubscriptionsService,
    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers
  ],
  imports: [
    CqrsModule,
    ConfigModule,
    SequelizeModule.forFeature([Subscription]),
    MailModule,
    UrlGeneratorModule
  ],
  exports: [
    SubscriptionsService,
    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers
  ]
})
export class SubscriptionsModule {}
