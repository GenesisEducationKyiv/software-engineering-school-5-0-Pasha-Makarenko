import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { ConfirmSubscriptionCommand } from "../impl/confirm-subscription.command"
import { Inject } from "@nestjs/common"
import {
  ISubscriptionsQueryRepository,
  SUBSCRIPTIONS_QUERY_REPOSITORY
} from "../../../../domain/subscriptions/repositories/subscriptions-query.repository.interface"
import { NotFoundException } from "../../../../domain/common/exceptions/not-found.exception"
import {
  ITransactionsManager,
  TRANSACTIONS_MANAGER
} from "../../../common/interfaces/transaction.manager"

@CommandHandler(ConfirmSubscriptionCommand)
export class ConfirmSubscriptionHandler
  implements ICommandHandler<ConfirmSubscriptionCommand>
{
  constructor(
    @Inject(SUBSCRIPTIONS_QUERY_REPOSITORY)
    private subscriptionsQueryRepository: ISubscriptionsQueryRepository,
    @Inject(TRANSACTIONS_MANAGER)
    private transactionManager: ITransactionsManager
  ) {}

  async execute(command: ConfirmSubscriptionCommand) {
    const { confirmationToken } = command

    const subscription =
      await this.subscriptionsQueryRepository.findByConfirmationToken(
        confirmationToken
      )

    if (!subscription) {
      throw new NotFoundException(
        `Subscription with confirmation token ${confirmationToken} not found`
      )
    }

    await this.transactionManager.transaction(async () => {
      subscription.confirm()
    })
  }
}
