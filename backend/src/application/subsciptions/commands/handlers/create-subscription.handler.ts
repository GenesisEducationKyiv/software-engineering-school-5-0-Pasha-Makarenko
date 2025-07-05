import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs"
import { CreateSubscriptionCommand } from "../impl/create-subscription.command"
import { Inject } from "@nestjs/common"
import { SubscriptionCreatedEvent } from "../../events/impl/subscription-created.event"
import {
  ISubscriptionsQueryRepository,
  SUBSCRIPTIONS_QUERY_REPOSITORY
} from "../../../../domain/subscriptions/repositories/subscriptions-query.repository.interface"
import {
  ISubscriptionsCommandRepository,
  SUBSCRIPTIONS_COMMAND_REPOSITORY
} from "../../../../domain/subscriptions/repositories/subscriptions-command.repository.interface"
import { SubscriptionAlreadyExistsException } from "../../../../domain/subscriptions/exceptions/subscription-already-exists.exception"
import { SubscriptionCreation } from "../../../../domain/subscriptions/value-objects/subscription-creation.value-object"
import { generateToken } from "../../../../infrastructure/subsciptions/utils/token.util"

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
    const { email, city, frequency } = command.dto

    const candidate =
      await this.subscriptionsQueryRepository.findByEmailAndCity(email, city)

    if (candidate) {
      throw new SubscriptionAlreadyExistsException(email, city)
    }

    const confirmationToken = generateToken()
    const unsubscribeToken = generateToken()

    const subscription = await this.subscriptionsCommandRepository.create(
      SubscriptionCreation.create(
        email,
        city,
        frequency,
        confirmationToken,
        unsubscribeToken
      )
    )

    this.eventBus.publish(new SubscriptionCreatedEvent(subscription))

    return subscription
  }
}
