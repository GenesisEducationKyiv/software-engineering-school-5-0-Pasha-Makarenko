import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { ConfirmSubscriptionCommand } from "../impl/confirm-subscription.command"
import { Inject } from "@nestjs/common"
import { SUBSCRIPTIONS_QUERY_REPOSITORY } from "../../repositories/subscriptions-query.repository"
import { SUBSCRIPTIONS_COMMAND_REPOSITORY } from "../../repositories/subscriptions-command.repository"
import { SubscriptionAlreadyConfirmedException } from "../../exceptions/subscription-already-confirmed.exception"
import { SubscriptionNotFoundException } from "../../exceptions/subscription-not-found.exception"
import { ISubscriptionsCommandRepository } from "../../interfaces/subscriptions-command.repository.interface"
import { ISubscriptionsQueryRepository } from "../../interfaces/subscriptions-query.repository.interface"

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

    if (subscription.isConfirmed) {
      throw new SubscriptionAlreadyConfirmedException()
    }

    await this.subscriptionsCommandRepository.confirmByToken(confirmationToken)

    return subscription
  }
}
