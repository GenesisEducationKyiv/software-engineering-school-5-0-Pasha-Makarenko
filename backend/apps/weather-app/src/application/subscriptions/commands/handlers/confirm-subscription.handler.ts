import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { ConfirmSubscriptionCommand } from "../impl/confirm-subscription.command"
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

@CommandHandler(ConfirmSubscriptionCommand)
export class ConfirmSubscriptionHandler
  implements ICommandHandler<ConfirmSubscriptionCommand>
{
  private readonly logger = new Logger(ConfirmSubscriptionHandler.name)

  constructor(
    @Inject(SUBSCRIPTIONS_QUERY_REPOSITORY)
    private subscriptionsQueryRepository: ISubscriptionsQueryRepository,
    @Inject(TRANSACTIONS_MANAGER)
    private transactionManager: ITransactionsManager,
    @Inject(SUBSCRIPTIONS_METRICS_SERVICE)
    private subscriptionsMetricsService: ISubscriptionsMetricsService
  ) {}

  async execute(command: ConfirmSubscriptionCommand) {
    const { confirmationToken } = command

    this.logger.log({
      operation: "confirmSubscription",
      params: command,
      message: "Confirming subscription"
    })

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

    this.subscriptionsMetricsService.recordSubscriptionConfirmed(
      subscription.city,
      subscription.frequency
    )
    this.logger.log({
      operation: "confirmSubscription",
      params: command,
      result: {
        subscription_id: subscription.id
      },
      message: "Subscription confirmed successfully"
    })
  }
}
