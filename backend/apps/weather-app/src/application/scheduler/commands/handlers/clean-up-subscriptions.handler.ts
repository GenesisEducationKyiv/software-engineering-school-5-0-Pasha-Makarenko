import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { CleanUpSubscriptionsCommand } from "../impl/clean-up-subscriptions.command"
import { Inject } from "@nestjs/common"
import {
  ITransactionsManager,
  TRANSACTIONS_MANAGER
} from "../../../common/interfaces/transaction.manager"
import {
  ISubscriptionsQueryRepository,
  SUBSCRIPTIONS_QUERY_REPOSITORY
} from "../../../../domain/subscriptions/repositories/subscriptions-query.repository.interface"
import {
  ISubscriptionsCommandRepository,
  SUBSCRIPTIONS_COMMAND_REPOSITORY
} from "../../../../domain/subscriptions/repositories/subscriptions-command.repository.interface"

@CommandHandler(CleanUpSubscriptionsCommand)
export class CleanUpSubscriptionsHandler
  implements ICommandHandler<CleanUpSubscriptionsCommand>
{
  constructor(
    @Inject(TRANSACTIONS_MANAGER)
    private transactionManager: ITransactionsManager,
    @Inject(SUBSCRIPTIONS_QUERY_REPOSITORY)
    private subscriptionsQueryRepository: ISubscriptionsQueryRepository,
    @Inject(SUBSCRIPTIONS_COMMAND_REPOSITORY)
    private subscriptionsCommandRepository: ISubscriptionsCommandRepository
  ) {}

  async execute(command: CleanUpSubscriptionsCommand) {
    await this.transactionManager.transaction(async em => {
      const { ttl } = command

      const inactiveSubscriptions =
        await this.subscriptionsQueryRepository.findAllInactiveByTime(ttl, em)

      for (const subscription of inactiveSubscriptions) {
        await this.subscriptionsCommandRepository.delete(subscription, em)
      }
    })
  }
}
