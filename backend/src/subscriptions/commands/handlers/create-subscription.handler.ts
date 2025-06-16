import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs"
import { CreateSubscriptionCommand } from "../impl/create-subscription.command"
import { InjectModel } from "@nestjs/sequelize"
import { Subscription } from "../../models/subscription.model"
import { ConflictException } from "@nestjs/common"
import { generateToken } from "../../../shared/utils/token.util"
import { SubscriptionCreatedEvent } from "../../events/impl/subscription-created.event"

@CommandHandler(CreateSubscriptionCommand)
export class CreateSubscriptionHandler
  implements ICommandHandler<CreateSubscriptionCommand>
{
  constructor(
    @InjectModel(Subscription)
    private subscriptionsRepository: typeof Subscription,
    private eventBus: EventBus
  ) {}

  async execute(command: CreateSubscriptionCommand) {
    const { dto } = command

    const candidate = await this.subscriptionsRepository.findOne({
      where: {
        email: dto.email,
        city: dto.city
      }
    })

    if (candidate) {
      throw new ConflictException("Subscription already exists")
    }

    const confirmationToken = generateToken()
    const unsubscribeToken = generateToken()

    const subscription = await this.subscriptionsRepository.create({
      ...dto,
      confirmationToken,
      unsubscribeToken
    })

    if (!subscription) {
      throw new ConflictException("Subscription creation failed")
    }

    this.eventBus.publish(new SubscriptionCreatedEvent(subscription))

    return subscription
  }
}
