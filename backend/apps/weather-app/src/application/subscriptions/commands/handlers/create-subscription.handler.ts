import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs"
import { CreateSubscriptionCommand } from "../impl/create-subscription.command"
import { Inject, Logger } from "@nestjs/common"
import { SubscriptionCreatedEvent } from "../../events/impl/subscription-created.event"
import {
  ISubscriptionsCommandRepository,
  SUBSCRIPTIONS_COMMAND_REPOSITORY
} from "../../../../domain/subscriptions/repositories/subscriptions-command.repository.interface"
import { SubscriptionFactory } from "../../../../domain/subscriptions/factories/subscription.factory"
import {
  ITransactionsManager,
  TRANSACTIONS_MANAGER
} from "../../../common/interfaces/transaction.manager"
import {
  ITokenService,
  TOKEN_SERVICE
} from "../../../common/interfaces/token-service.interface"

@CommandHandler(CreateSubscriptionCommand)
export class CreateSubscriptionHandler
  implements ICommandHandler<CreateSubscriptionCommand>
{
  private readonly logger = new Logger(CreateSubscriptionHandler.name)

  constructor(
    @Inject(SUBSCRIPTIONS_COMMAND_REPOSITORY)
    private subscriptionsCommandRepository: ISubscriptionsCommandRepository,
    private subscriptionFactory: SubscriptionFactory,
    @Inject(TRANSACTIONS_MANAGER)
    private transactionManager: ITransactionsManager,
    @Inject(TOKEN_SERVICE)
    private tokenService: ITokenService,
    private eventBus: EventBus
  ) {}

  async execute(command: CreateSubscriptionCommand) {
    const { email, city, frequency } = command.dto

    this.logger.log({
      operation: "createSubscription",
      params: command.dto,
      message: "Creating new subscription"
    })

    const confirmationToken = this.tokenService.generate()
    const unsubscribeToken = this.tokenService.generate()

    const subscription = await this.subscriptionFactory.create(
      email,
      city,
      frequency,
      confirmationToken,
      unsubscribeToken
    )

    await this.transactionManager.transaction(async em => {
      await this.subscriptionsCommandRepository.add(subscription, em)
    })

    this.eventBus.publish(new SubscriptionCreatedEvent(subscription))

    this.logger.log({
      operation: "createSubscription",
      params: command.dto,
      result: {
        subscription_id: subscription.id
      },
      message: "Subscription created successfully"
    })
  }
}
