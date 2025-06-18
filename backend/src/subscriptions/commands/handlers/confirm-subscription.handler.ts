import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { ConfirmSubscriptionCommand } from "../impl/confirm-subscription.command"
import { InjectModel } from "@nestjs/sequelize"
import { Subscription } from "../../models/subscription.model"
import { NotFoundException } from "@nestjs/common"

@CommandHandler(ConfirmSubscriptionCommand)
export class ConfirmSubscriptionHandler
  implements ICommandHandler<ConfirmSubscriptionCommand>
{
  constructor(
    @InjectModel(Subscription)
    private subscriptionsRepository: typeof Subscription
  ) {}

  async execute(command: ConfirmSubscriptionCommand) {
    const { confirmationToken } = command

    const subscription = await this.subscriptionsRepository.findOne({
      where: { confirmationToken }
    })

    if (!subscription || subscription.isConfirmed) {
      throw new NotFoundException("Subscription not found or already confirmed")
    }

    await subscription.update({
      isConfirmed: true
    })

    return subscription
  }
}
