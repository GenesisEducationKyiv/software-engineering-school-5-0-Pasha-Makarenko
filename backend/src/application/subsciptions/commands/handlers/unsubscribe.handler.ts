import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { UnsubscribeCommand } from "../impl/unsubscribe.command"
import { Inject } from "@nestjs/common"
import {
  ISubscriptionsCommandRepository,
  SUBSCRIPTIONS_COMMAND_REPOSITORY
} from "../../../../domain/subscriptions/repositories/subscriptions-command.repository.interface"
import {
  ISubscriptionsQueryRepository,
  SUBSCRIPTIONS_QUERY_REPOSITORY
} from "../../../../domain/subscriptions/repositories/subscriptions-query.repository.interface"
import { NotFoundException } from "../../../../domain/common/exceptions/not-found.exception"
import {
  ITransactionsManager,
  TRANSACTIONS_MANAGER
} from "../../../common/interfaces/transaction.manager"

@CommandHandler(UnsubscribeCommand)
export class UnsubscribeHandler implements ICommandHandler<UnsubscribeCommand> {
  constructor(
    @Inject(SUBSCRIPTIONS_QUERY_REPOSITORY)
    private subscriptionsQueryRepository: ISubscriptionsQueryRepository,
    @Inject(SUBSCRIPTIONS_COMMAND_REPOSITORY)
    private subscriptionsCommandRepository: ISubscriptionsCommandRepository,
    @Inject(TRANSACTIONS_MANAGER)
    private transactionManager: ITransactionsManager
  ) {}

  async execute(command: UnsubscribeCommand) {
    const { unsubscribeToken } = command

    const subscription =
      await this.subscriptionsQueryRepository.findByUnsubscribeToken(
        unsubscribeToken
      )

    if (!subscription) {
      throw new NotFoundException(
        `Subscription with unsubscribe token ${unsubscribeToken} not found`
      )
    }

    await this.transactionManager.transaction(async em => {
      await this.subscriptionsCommandRepository.delete(subscription, em)
    })
  }
}
