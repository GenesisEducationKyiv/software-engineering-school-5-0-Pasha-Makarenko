import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { CleanUpSubscriptionsCommand } from "../impl/clean-up-subscriptions.command"
import { Inject, Logger } from "@nestjs/common"
import {
  ITransactionsManager,
  TRANSACTIONS_MANAGER
} from "../../../common/interfaces/transaction.manager"
import {
  ISubscriptionsQueryRepository,
  SUBSCRIPTIONS_QUERY_REPOSITORY
} from "../../../../domain/subscriptions/repositories/subscriptions-query.repository.interface"

@CommandHandler(CleanUpSubscriptionsCommand)
export class CleanUpSubscriptionsHandler
  implements ICommandHandler<CleanUpSubscriptionsCommand>
{
  private readonly logger = new Logger(CleanUpSubscriptionsHandler.name)

  constructor(
    @Inject(TRANSACTIONS_MANAGER)
    private transactionManager: ITransactionsManager,
    @Inject(SUBSCRIPTIONS_QUERY_REPOSITORY)
    private subscriptionsQueryRepository: ISubscriptionsQueryRepository
  ) {}

  async execute(command: CleanUpSubscriptionsCommand) {
    const { ttl } = command

    const inactiveSubscriptions =
      await this.subscriptionsQueryRepository.findAllInactiveByTime(ttl)

    this.logger.log({
      operation: "cleanUpSubscriptions",
      params: { ttl, count: inactiveSubscriptions.length },
      message: "Cleaning up inactive subscriptions"
    })

    for (const subscription of inactiveSubscriptions) {
      try {
        await this.transactionManager.transaction(async em => {
          subscription.unsubscribe()
        })
      } catch (error) {
        this.logger.error({
          operation: "cleanUpSubscriptions",
          params: { subscriptionId: subscription.id },
          error: error.message,
          message: "Failed to delete subscription"
        })
      }
    }
  }
}
