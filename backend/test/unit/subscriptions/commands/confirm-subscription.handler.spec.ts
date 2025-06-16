import { Test } from "@nestjs/testing"
import { getModelToken } from "@nestjs/sequelize"
import { NotFoundException } from "@nestjs/common"
import { ConfirmSubscriptionHandler } from "../../../../src/subscriptions/commands/handlers/confirm-subscription.handler"
import { ConfirmSubscriptionCommand } from "../../../../src/subscriptions/commands/impl/confirm-subscription.command"
import { Subscription } from "../../../../src/subscriptions/models/subscription.model"

describe("ConfirmSubscriptionHandler", () => {
  let handler: ConfirmSubscriptionHandler
  let subscriptionsRepository: typeof Subscription

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ConfirmSubscriptionHandler,
        {
          provide: getModelToken(Subscription),
          useValue: {
            findOne: jest.fn(),
            update: jest.fn()
          }
        }
      ]
    }).compile()

    handler = moduleRef.get<ConfirmSubscriptionHandler>(
      ConfirmSubscriptionHandler
    )
    subscriptionsRepository = moduleRef.get<typeof Subscription>(
      getModelToken(Subscription)
    )
  })

  describe("execute", () => {
    it("should confirm subscription when token is valid", async () => {
      const token = "valid-token"
      const command = new ConfirmSubscriptionCommand(token)
      const mockSubscription = {
        id: "1",
        isConfirmed: false,
        update: jest.fn().mockResolvedValue({ id: "1", isConfirmed: true })
      } as never as Subscription

      jest
        .spyOn(subscriptionsRepository, "findOne")
        .mockResolvedValue(mockSubscription)

      const result = await handler.execute(command)

      expect(subscriptionsRepository.findOne).toHaveBeenCalledWith({
        where: { confirmationToken: token }
      })
      expect(mockSubscription.update).toHaveBeenCalledWith({
        isConfirmed: true
      })
      expect(result).toBeDefined()
    })

    it("should throw NotFoundException when token is invalid", async () => {
      const token = "invalid-token"
      const command = new ConfirmSubscriptionCommand(token)

      jest.spyOn(subscriptionsRepository, "findOne").mockResolvedValue(null)

      await expect(handler.execute(command)).rejects.toThrow(NotFoundException)
    })
  })
})
