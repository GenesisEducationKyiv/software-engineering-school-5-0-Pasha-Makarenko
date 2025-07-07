import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs"
import { CreateSubscriptionCommand } from "../impl/create-subscription.command"
import { Inject } from "@nestjs/common"
import { SubscriptionCreatedEvent } from "../../events/impl/subscription-created.event"
import {
  ISubscriptionsCommandRepository,
  SUBSCRIPTIONS_COMMAND_REPOSITORY
} from "../../../../domain/subscriptions/repositories/subscriptions-command.repository.interface"
import { generateToken } from "../../../../infrastructure/subscriptions/utils/token.util"
import { SubscriptionFactory } from "../../../../domain/subscriptions/factories/subscription.factory"
import {
  ITransactionsManager,
  TRANSACTIONS_MANAGER
} from "../../../common/interfaces/transaction.manager"

@CommandHandler(CreateSubscriptionCommand)
export class CreateSubscriptionHandler
  implements ICommandHandler<CreateSubscriptionCommand>
{
  constructor(
    @Inject(SUBSCRIPTIONS_COMMAND_REPOSITORY)
    private subscriptionsCommandRepository: ISubscriptionsCommandRepository,
    private subscriptionFactory: SubscriptionFactory,
    @Inject(TRANSACTIONS_MANAGER)
    private transactionManager: ITransactionsManager,
    private eventBus: EventBus
  ) {}

  async execute(command: CreateSubscriptionCommand) {
    const { email, city, frequency } = command.dto

    const confirmationToken = generateToken()
    const unsubscribeToken = generateToken()

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
  }
}
