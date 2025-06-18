import { Test } from "@nestjs/testing"
import { getModelToken } from "@nestjs/sequelize"
import { ConflictException } from "@nestjs/common"
import { CreateSubscriptionHandler } from "../../../../src/subscriptions/commands/handlers/create-subscription.handler"
import { CreateSubscriptionCommand } from "../../../../src/subscriptions/commands/impl/create-subscription.command"
import { Subscription } from "../../../../src/subscriptions/models/subscription.model"
import { createSubscriptionDtoMock } from "../../../mocks/dto/create-subscription.dto.mock"
import { EventBus } from "@nestjs/cqrs"
import { eventBusMockFactory } from "../../../mocks/services/cqrs.mock"

describe("CreateSubscriptionHandler", () => {
  let handler: CreateSubscriptionHandler
  let subscriptionModel: typeof Subscription

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateSubscriptionHandler,
        {
          provide: getModelToken(Subscription),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn()
          }
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
    subscriptionModel = moduleRef.get<typeof Subscription>(
      getModelToken(Subscription)
    )
  })

  it("should create new subscription", async () => {
    const command = new CreateSubscriptionCommand(createSubscriptionDtoMock)

    jest.spyOn(subscriptionModel, "findOne").mockResolvedValue(null)
    jest.spyOn(subscriptionModel, "create").mockResolvedValue({
      id: "1",
      ...createSubscriptionDtoMock,
      confirmationToken: "token"
    } as Subscription)

    const result = await handler.execute(command)

    expect(result).toBeDefined()
    expect(subscriptionModel.create).toHaveBeenCalled()
  })

  it("should throw when subscription exists", async () => {
    const command = new CreateSubscriptionCommand(createSubscriptionDtoMock)

    jest
      .spyOn(subscriptionModel, "findOne")
      .mockResolvedValue({} as Subscription)

    await expect(handler.execute(command)).rejects.toThrow(ConflictException)
  })
})
