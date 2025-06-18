import { Test } from "@nestjs/testing"
import { ConflictException } from "@nestjs/common"
import { EventBus } from "@nestjs/cqrs"
import { getModelToken } from "@nestjs/sequelize"
import { CreateSubscriptionHandler } from "../../../../src/subscriptions/commands/handlers/create-subscription.handler"
import { CreateSubscriptionCommand } from "../../../../src/subscriptions/commands/impl/create-subscription.command"
import { SubscriptionCreatedEvent } from "../../../../src/subscriptions/events/impl/subscription-created.event"
import { Subscription } from "../../../../src/subscriptions/models/subscription.model"
import { eventBusMockFactory } from "../../../mocks/services/cqrs.mock"
import { createSubscriptionDtoMock } from "../../../mocks/dto/create-subscription.dto.mock"

describe("CreateSubscriptionHandler", () => {
  let handler: CreateSubscriptionHandler
  let subscriptionsRepository: typeof Subscription
  let eventBus: EventBus

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
    subscriptionsRepository = moduleRef.get<typeof Subscription>(
      getModelToken(Subscription)
    )
    eventBus = moduleRef.get<EventBus>(EventBus)
  })

  describe("execute", () => {
    it("should create new subscription when email is unique", async () => {
      const dto = createSubscriptionDtoMock
      const command = new CreateSubscriptionCommand(dto)

      jest.spyOn(subscriptionsRepository, "findOne").mockResolvedValue(null)
      jest.spyOn(subscriptionsRepository, "create").mockResolvedValue({
        id: "1",
        ...dto,
        confirmationToken: "token-123",
        unsubscribeToken: "token-456",
        isConfirmed: false
      } as Subscription)

      const result = await handler.execute(command)

      expect(subscriptionsRepository.findOne).toHaveBeenCalledWith({
        where: { email: dto.email, city: dto.city }
      })
      expect(subscriptionsRepository.create).toHaveBeenCalledWith({
        ...dto,
        confirmationToken: expect.any(String),
        unsubscribeToken: expect.any(String)
      })
      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.any(SubscriptionCreatedEvent)
      )
      expect(result).toBeDefined()
    })

    it("should throw ConflictException when email already exists", async () => {
      const dto = createSubscriptionDtoMock
      const command = new CreateSubscriptionCommand(dto)

      jest.spyOn(subscriptionsRepository, "findOne").mockResolvedValue({
        id: "1",
        ...dto
      } as Subscription)

      await expect(handler.execute(command)).rejects.toThrow(ConflictException)
    })

    it("should throw ConflictException when creation fails", async () => {
      const dto = createSubscriptionDtoMock
      const command = new CreateSubscriptionCommand(dto)

      jest.spyOn(subscriptionsRepository, "findOne").mockResolvedValue(null)
      jest.spyOn(subscriptionsRepository, "create").mockResolvedValue(null)

      await expect(handler.execute(command)).rejects.toThrow(ConflictException)
    })
  })
})
