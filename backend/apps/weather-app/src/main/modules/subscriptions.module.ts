import { Module } from "@nestjs/common"
import { MikroOrmModule } from "@mikro-orm/nestjs"
import { SubscriptionsController } from "../../presentation/subscriptions/controllers/subscriptions.controller"
import { NotificationsModule } from "./notifications.module"
import { ConfigModule } from "@nestjs/config"
import { CqrsModule } from "@nestjs/cqrs"
import { CreateSubscriptionHandler } from "../../application/subscriptions/commands/handlers/create-subscription.handler"
import { UnsubscribeHandler } from "../../application/subscriptions/commands/handlers/unsubscribe.handler"
import { ConfirmSubscriptionHandler } from "../../application/subscriptions/commands/handlers/confirm-subscription.handler"
import { GetActiveSubscriptionsHandler } from "../../application/subscriptions/queries/handlers/get-active-subscriptions.handler"
import { SubscriptionCreatedHandler } from "../../application/subscriptions/events/handlers/subscription-created.handler"
import { SubscriptionsQueryRepository } from "../../infrastructure/subscriptions/persistence/repositories/subscriptions-query.repository"
import { SubscriptionsCommandRepository } from "../../infrastructure/subscriptions/persistence/repositories/subscriptions-command.repository"
import { SUBSCRIPTIONS_QUERY_REPOSITORY } from "../../domain/subscriptions/repositories/subscriptions-query.repository.interface"
import { SUBSCRIPTIONS_COMMAND_REPOSITORY } from "../../domain/subscriptions/repositories/subscriptions-command.repository.interface"
import { SubscriptionSchema } from "../../infrastructure/subscriptions/persistence/schemas/subscription.schema"
import { SubscriptionFactory } from "../../domain/subscriptions/factories/subscription.factory"
import { InfrastructureModule } from "./infrastructure.module"
import { MetricsModule } from "./metrics.module"

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
    InfrastructureModule,
    MetricsModule,
    NotificationsModule
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
