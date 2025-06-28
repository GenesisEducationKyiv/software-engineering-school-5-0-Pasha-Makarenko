import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { UnsubscribeCommand } from "../impl/unsubscribe.command"
import { Inject } from "@nestjs/common"
import { SUBSCRIPTIONS_QUERY_REPOSITORY } from "../../repositories/subscriptions-query.repository"
import { SUBSCRIPTIONS_COMMAND_REPOSITORY } from "../../repositories/subscriptions-command.repository"
import { SubscriptionNotFoundException } from "../../exceptions/subscription-not-found.exception"
import { ISubscriptionsCommandRepository } from "../../interfaces/subscriptions-command.repository.interface"
import { ISubscriptionsQueryRepository } from "../../interfaces/subscriptions-query.repository.interface"

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

    return await this.subscriptionsCommandRepository.unsubscribeByToken(
      unsubscribeToken
    )
  }
}
