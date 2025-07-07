import { Test } from "@nestjs/testing"
import { EventBus } from "@nestjs/cqrs"
import { subscriptionsQueryRepositoryMockFactory } from "../../mocks/repositories/subscriptions-query.repository.mock"
import { subscriptionsCommandRepositoryMockFactory } from "../../mocks/repositories/subscriptions-command.repository.mock"
import { CreateSubscriptionHandler } from "../../../src/application/subsciptions/commands/handlers/create-subscription.handler"
import {
  ISubscriptionsQueryRepository,
  SUBSCRIPTIONS_QUERY_REPOSITORY
} from "../../../src/domain/subscriptions/repositories/subscriptions-query.repository.interface"
import {
  ISubscriptionsCommandRepository,
  SUBSCRIPTIONS_COMMAND_REPOSITORY
} from "../../../src/domain/subscriptions/repositories/subscriptions-command.repository.interface"
import { eventBusMockFactory } from "../../mocks/services/cqrs.mock"
import { CreateSubscriptionCommand } from "../../../src/application/subsciptions/commands/impl/create-subscription.command"
import { createSubscriptionDtoMock } from "../../mocks/dto/create-subscription.dto.mock"
import { subscriptionsMock } from "../../mocks/entities/subscription.entity.mock"
import { TRANSACTIONS_MANAGER } from "../../../src/application/common/interfaces/transaction.manager"
import { transactionsManagerMockFactory } from "../../mocks/managers/transactions.manager.mock"
import { SubscriptionFactory } from "../../../src/domain/subscriptions/factories/subscription.factory"

describe("CreateSubscriptionHandler", () => {
  let handler: CreateSubscriptionHandler
  let subscriptionsQueryRepository: ISubscriptionsQueryRepository
  let subscriptionsCommandRepository: ISubscriptionsCommandRepository

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateSubscriptionHandler,
        SubscriptionFactory,
        {
          provide: SUBSCRIPTIONS_QUERY_REPOSITORY,
          useValue: subscriptionsQueryRepositoryMockFactory()
        },
        {
          provide: SUBSCRIPTIONS_COMMAND_REPOSITORY,
          useValue: subscriptionsCommandRepositoryMockFactory()
        },
        {
          provide: TRANSACTIONS_MANAGER,
          useValue: transactionsManagerMockFactory()
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
    jest.spyOn(subscriptionsCommandRepository, "add")

    await handler.execute(command)

    expect(subscriptionsCommandRepository.add).toHaveBeenCalled()
  })

  it("should throw when subscription exists", async () => {
    const command = new CreateSubscriptionCommand(createSubscriptionDtoMock)

    jest
      .spyOn(subscriptionsQueryRepository, "findByEmailAndCity")
      .mockResolvedValue(subscriptionsMock[0])

    await expect(handler.execute(command)).rejects.toThrow(
      `Subscription with email ${createSubscriptionDtoMock.email} and city ${createSubscriptionDtoMock.city} already exists`
    )
  })
})
