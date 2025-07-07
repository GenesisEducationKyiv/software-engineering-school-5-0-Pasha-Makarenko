import { Module } from "@nestjs/common"
import { MikroOrmModule } from "@mikro-orm/nestjs"
import { SubscriptionsController } from "../../presentation/subscriptions/controllers/subscriptions.controller"
import { MailModule } from "./mail.module"
import { ConfigModule } from "@nestjs/config"
import { CqrsModule } from "@nestjs/cqrs"
import { CreateSubscriptionHandler } from "../../application/subsciptions/commands/handlers/create-subscription.handler"
import { UnsubscribeHandler } from "../../application/subsciptions/commands/handlers/unsubscribe.handler"
import { ConfirmSubscriptionHandler } from "../../application/subsciptions/commands/handlers/confirm-subscription.handler"
import { GetActiveSubscriptionsHandler } from "../../application/subsciptions/queries/handlers/get-active-subscriptions.handler"
import { SubscriptionCreatedHandler } from "../../application/subsciptions/events/handlers/subscription-created.handler"
import { UrlGeneratorModule } from "./url-generator.module"
import { SubscriptionsQueryRepository } from "../../infrastructure/subsciptions/persistence/repositories/subscriptions-query.repository"
import { SubscriptionsCommandRepository } from "../../infrastructure/subsciptions/persistence/repositories/subscriptions-command.repository"
import { SUBSCRIPTIONS_QUERY_REPOSITORY } from "../../domain/subscriptions/repositories/subscriptions-query.repository.interface"
import { SUBSCRIPTIONS_COMMAND_REPOSITORY } from "../../domain/subscriptions/repositories/subscriptions-command.repository.interface"
import { SubscriptionSchema } from "../../infrastructure/subsciptions/persistence/schemas/subscription.schema"
import { SubscriptionFactory } from "../../domain/subscriptions/factories/subscription.factory"
import { TransactionsModule } from "./transactions.module"

const commandHandlers = [
  CreateSubscriptionHandler,
  ConfirmSubscriptionHandler,
  UnsubscribeHandler
]

const queryHandlers = [GetActiveSubscriptionsHandler]

const eventHandlers = [SubscriptionCreatedHandler]

const factories = [SubscriptionFactory]

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
    ...repositories,
    ...factories
  ],
  imports: [
    CqrsModule,
    ConfigModule,
    MikroOrmModule.forFeature([SubscriptionSchema]),
    TransactionsModule,
    MailModule,
    UrlGeneratorModule
  ],
  exports: [
    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers,
    ...repositories,
    ...factories
  ]
})
export class SubscriptionsModule {}
