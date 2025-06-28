import { Test } from "@nestjs/testing"
import { EventBus } from "@nestjs/cqrs"
import { SUBSCRIPTIONS_QUERY_REPOSITORY } from "../../../src/subscriptions/repositories/subscriptions-query.repository"
import { subscriptionsQueryRepositoryMockFactory } from "../../mocks/repositories/subscriptions-query.repository.mock"
import { SUBSCRIPTIONS_COMMAND_REPOSITORY } from "../../../src/subscriptions/repositories/subscriptions-command.repository"
import { subscriptionsCommandRepositoryMockFactory } from "../../mocks/repositories/subscriptions-command.repository.mock"
import { CreateSubscriptionHandler } from "../../../src/subscriptions/commands/handlers/create-subscription.handler"
import { ISubscriptionsQueryRepository } from "../../../src/subscriptions/interfaces/subscriptions-query.repository.interface"
import { ISubscriptionsCommandRepository } from "../../../src/subscriptions/interfaces/subscriptions-command.repository.interface"
import { eventBusMockFactory } from "../../mocks/services/cqrs.mock"
import { CreateSubscriptionCommand } from "../../../src/subscriptions/commands/impl/create-subscription.command"
import { createSubscriptionDtoMock } from "../../mocks/dto/create-subscription.dto.mock"
import { subscriptionModelsMock } from "../../mocks/models/subscription.model.mock"

describe("CreateSubscriptionHandler", () => {
  let handler: CreateSubscriptionHandler
  let subscriptionsQueryRepository: ISubscriptionsQueryRepository
  let subscriptionsCommandRepository: ISubscriptionsCommandRepository

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateSubscriptionHandler,
        {
          provide: SUBSCRIPTIONS_QUERY_REPOSITORY,
          useValue: subscriptionsQueryRepositoryMockFactory()
        },
        {
          provide: SUBSCRIPTIONS_COMMAND_REPOSITORY,
          useValue: subscriptionsCommandRepositoryMockFactory()
        },
        {
          provide: EventBus,
          useValue: eventBusMockFactory()
        }
      ]
    }).compile()

    handler = moduleRef.get<CreateSubscriptionHandler>(
      CreateSubscriptionHandler
    )
    subscriptionsQueryRepository = moduleRef.get<ISubscriptionsQueryRepository>(
      SUBSCRIPTIONS_QUERY_REPOSITORY
    )
    subscriptionsCommandRepository =
      moduleRef.get<ISubscriptionsCommandRepository>(
        SUBSCRIPTIONS_COMMAND_REPOSITORY
      )
  })

  it("should create new subscription", async () => {
    const command = new CreateSubscriptionCommand(createSubscriptionDtoMock)

    jest
      .spyOn(subscriptionsQueryRepository, "findByEmailAndCity")
      .mockResolvedValue(null)
    jest
      .spyOn(subscriptionsCommandRepository, "create")
      .mockResolvedValue(subscriptionModelsMock[2])

    const result = await handler.execute(command)

    expect(result).toBeDefined()
    expect(subscriptionsCommandRepository.create).toHaveBeenCalled()
  })

  it("should throw when subscription exists", async () => {
    const command = new CreateSubscriptionCommand(createSubscriptionDtoMock)

    jest
      .spyOn(subscriptionsQueryRepository, "findByEmailAndCity")
      .mockResolvedValue(subscriptionModelsMock[0])

    await expect(handler.execute(command)).rejects.toThrow(
      "Subscription already exists"
    )
  })
})
