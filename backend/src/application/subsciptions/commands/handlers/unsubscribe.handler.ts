import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { UnsubscribeCommand } from "../impl/unsubscribe.command"
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

@CommandHandler(UnsubscribeCommand)
export class UnsubscribeHandler implements ICommandHandler<UnsubscribeCommand> {
  constructor(
    @Inject(SUBSCRIPTIONS_QUERY_REPOSITORY)
    private subscriptionsQueryRepository: ISubscriptionsQueryRepository,
    @Inject(SUBSCRIPTIONS_COMMAND_REPOSITORY)
    private subscriptionsCommandRepository: ISubscriptionsCommandRepository
  ) {}

  async execute(command: UnsubscribeCommand) {
    const { unsubscribeToken } = command

    const subscription =
      await this.subscriptionsQueryRepository.findByUnsubscribeToken(
        unsubscribeToken
      )

    if (!subscription) {
      throw new SubscriptionNotFoundException(
        "Subscription not found or already unsubscribed"
      )
    }

    return await this.subscriptionsCommandRepository.delete(subscription.id)
  }
}
