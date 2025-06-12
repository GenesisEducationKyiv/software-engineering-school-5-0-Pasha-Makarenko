import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { UnsubscribeCommand } from "../unsubscribe.command"
import { InjectModel } from "@nestjs/sequelize"
import { Subscription } from "../../subscription.model"
import { NotFoundException } from "@nestjs/common"

@CommandHandler(UnsubscribeCommand)
export class UnsubscribeHandler implements ICommandHandler<UnsubscribeCommand> {
  constructor(
    @InjectModel(Subscription)
    private subscriptionsRepository: typeof Subscription
  ) {}

  async execute(command: UnsubscribeCommand) {
    const { unsubscribeToken } = command

    const subscription = await this.subscriptionsRepository.findOne({
      where: { unsubscribeToken }
    })

    if (!subscription) {
      throw new NotFoundException(
        "Subscription not found or already unsubscribed"
      )
    }

    return await subscription.destroy()
  }
}
