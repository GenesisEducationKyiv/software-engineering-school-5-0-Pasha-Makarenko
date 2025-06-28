import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs"
import { CreateSubscriptionCommand } from "../impl/create-subscription.command"
import { Inject } from "@nestjs/common"
import { generateToken } from "../../../shared/utils/token.util"
import { SubscriptionCreatedEvent } from "../../events/impl/subscription-created.event"
import { SUBSCRIPTIONS_QUERY_REPOSITORY } from "../../repositories/subscriptions-query.repository"
import { SUBSCRIPTIONS_COMMAND_REPOSITORY } from "../../repositories/subscriptions-command.repository"
import { ISubscriptionsQueryRepository } from "../../interfaces/subscriptions-query.repository.interface"
import { ISubscriptionsCommandRepository } from "../../interfaces/subscriptions-command.repository.interface"
import { SubscriptionAlreadyExistsException } from "../../exceptions/subscription-already-exists.exception"
import { SubscriptionCreationFailedException } from "../../exceptions/subscription-creation-failed.exception"

@CommandHandler(CreateSubscriptionCommand)
export class CreateSubscriptionHandler
  implements ICommandHandler<CreateSubscriptionCommand>
{
  constructor(
    @Inject(SUBSCRIPTIONS_QUERY_REPOSITORY)
    private subscriptionsQueryRepository: ISubscriptionsQueryRepository,
    @Inject(SUBSCRIPTIONS_COMMAND_REPOSITORY)
    private subscriptionsCommandRepository: ISubscriptionsCommandRepository,
    private eventBus: EventBus
  ) {}

  async execute(command: CreateSubscriptionCommand) {
    const { dto } = command

    const candidate =
      await this.subscriptionsQueryRepository.findByEmailAndCity({
        email: dto.email,
        city: dto.city
      })

    if (candidate) {
      throw new SubscriptionAlreadyExistsException(dto.email, dto.city)
    }

    const confirmationToken = generateToken()
    const unsubscribeToken = generateToken()

    const subscription = await this.subscriptionsCommandRepository.create({
      ...dto,
      confirmationToken,
      unsubscribeToken
    })

    if (!subscription) {
      throw new SubscriptionCreationFailedException()
    }

    this.eventBus.publish(new SubscriptionCreatedEvent(subscription))

    return subscription
  }
}
