import { Module } from "@nestjs/common"
import { SequelizeModule } from "@nestjs/sequelize"
import { Subscription } from "./models/subscription.model"
import { SubscriptionsController } from "./controllers/subscriptions.controller"
import { MailModule } from "../mail/mail.module"
import { ConfigModule } from "@nestjs/config"
import { CqrsModule } from "@nestjs/cqrs"
import { CreateSubscriptionHandler } from "./commands/handlers/create-subscription.handler"
import { UnsubscribeHandler } from "./commands/handlers/unsubscribe.handler"
import { ConfirmSubscriptionHandler } from "./commands/handlers/confirm-subscription.handler"
import { GetActiveSubscriptionsHandler } from "./queries/handlers/get-active-subscriptions.handler"
import { SubscriptionCreatedHandler } from "./events/handlers/subscription-created.handler"
import { UrlGeneratorModule } from "../url-generator/url-generator.module"
import {
  SUBSCRIPTIONS_QUERY_REPOSITORY,
  SubscriptionsQueryRepository
} from "./repositories/subscriptions-query.repository"
import {
  SUBSCRIPTIONS_COMMAND_REPOSITORY,
  SubscriptionsCommandRepository
} from "./repositories/subscriptions-command.repository"

const commandHandlers = [
  CreateSubscriptionHandler,
  ConfirmSubscriptionHandler,
  UnsubscribeHandler
]

const queryHandlers = [GetActiveSubscriptionsHandler]

const eventHandlers = [SubscriptionCreatedHandler]

const repositories = [
  {
    provide: SUBSCRIPTIONS_QUERY_REPOSITORY,
    useClass: SubscriptionsQueryRepository
  },
  {
    provide: SUBSCRIPTIONS_COMMAND_REPOSITORY,
    useClass: SubscriptionsCommandRepository
  }
]

@Module({
  controllers: [SubscriptionsController],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers,
    ...repositories
  ],
  imports: [
    CqrsModule,
    ConfigModule,
    SequelizeModule.forFeature([Subscription]),
    MailModule,
    UrlGeneratorModule
  ],
  exports: [
    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers,
    ...repositories
  ]
})
export class SubscriptionsModule {}
