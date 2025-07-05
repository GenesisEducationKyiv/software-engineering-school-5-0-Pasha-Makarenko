import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { ConfirmSubscriptionCommand } from "../impl/confirm-subscription.command"
import { Inject } from "@nestjs/common"
import { SubscriptionNotFoundException } from "../../exceptions/subscription-not-found.exception"
import {
  ISubscriptionsCommandRepository,
  SUBSCRIPTIONS_COMMAND_REPOSITORY
} from "../../../../domain/subscriptions/repositories/subscriptions-command.repository.interface"
import {
  ISubscriptionsQueryRepository,
  SUBSCRIPTIONS_QUERY_REPOSITORY
} from "../../../../domain/subscriptions/repositories/subscriptions-query.repository.interface"

@CommandHandler(ConfirmSubscriptionCommand)
export class ConfirmSubscriptionHandler
  implements ICommandHandler<ConfirmSubscriptionCommand>
{
  constructor(
    @Inject(SUBSCRIPTIONS_QUERY_REPOSITORY)
    private subscriptionsQueryRepository: ISubscriptionsQueryRepository,
    @Inject(SUBSCRIPTIONS_COMMAND_REPOSITORY)
    private subscriptionsCommandRepository: ISubscriptionsCommandRepository
  ) {}

  async execute(command: ConfirmSubscriptionCommand) {
    const { confirmationToken } = command

    const subscription =
      await this.subscriptionsQueryRepository.findByConfirmationToken(
        confirmationToken
      )

    if (!subscription) {
      throw new SubscriptionNotFoundException("Subscription not found")
    }

    subscription.confirm()

    await this.subscriptionsCommandRepository.update(subscription)

    return subscription
  }
}
