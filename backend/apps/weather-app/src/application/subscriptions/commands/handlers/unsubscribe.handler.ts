import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { UnsubscribeCommand } from "../impl/unsubscribe.command"
import { Inject, Logger } from "@nestjs/common"
import {
  ISubscriptionsQueryRepository,
  SUBSCRIPTIONS_QUERY_REPOSITORY
} from "../../../../domain/subscriptions/repositories/subscriptions-query.repository.interface"
import { NotFoundException } from "../../../../domain/common/exceptions/not-found.exception"
import {
  ITransactionsManager,
  TRANSACTIONS_MANAGER
} from "../../../common/interfaces/transaction.manager"
import {
  ISubscriptionsMetricsService,
  SUBSCRIPTIONS_METRICS_SERVICE
} from "../../../metrics/interfaces/subscriptions-metrics.interface"

@CommandHandler(UnsubscribeCommand)
export class UnsubscribeHandler implements ICommandHandler<UnsubscribeCommand> {
  private readonly logger = new Logger(UnsubscribeHandler.name)

  constructor(
    @Inject(SUBSCRIPTIONS_QUERY_REPOSITORY)
    private subscriptionsQueryRepository: ISubscriptionsQueryRepository,
    @Inject(TRANSACTIONS_MANAGER)
    private transactionManager: ITransactionsManager,
    @Inject(SUBSCRIPTIONS_METRICS_SERVICE)
    private subscriptionsMetricsService: ISubscriptionsMetricsService
  ) {}

  async execute(command: UnsubscribeCommand) {
    const { unsubscribeToken } = command

    this.logger.log({
      operation: "unsubscribe",
      params: command,
      message: "Unsubscribing from subscription"
    })

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
      subscription.unsubscribe()
    })

    this.subscriptionsMetricsService.recordSubscriptionUnsubscribed(
      subscription.city,
      subscription.frequency
    )
    this.logger.log({
      operation: "unsubscribe",
      params: command,
      result: {
        subscription_id: subscription.id
      },
      message: "Subscription unsubscribed successfully"
    })
  }
}
