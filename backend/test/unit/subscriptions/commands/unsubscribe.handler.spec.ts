import { Test } from "@nestjs/testing"
import { getModelToken } from "@nestjs/sequelize"
import { NotFoundException } from "@nestjs/common"
import { UnsubscribeHandler } from "../../../../src/subscriptions/commands/handlers/unsubscribe.handler"
import { UnsubscribeCommand } from "../../../../src/subscriptions/commands/impl/unsubscribe.command"
import { Subscription } from "../../../../src/subscriptions/models/subscription.model"

describe("UnsubscribeHandler", () => {
  let handler: UnsubscribeHandler
  let subscriptionsRepository: typeof Subscription

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UnsubscribeHandler,
        {
          provide: getModelToken(Subscription),
          useValue: {
            findOne: jest.fn(),
            destroy: jest.fn()
          }
        }
      ]
    }).compile()

    handler = moduleRef.get<UnsubscribeHandler>(UnsubscribeHandler)
    subscriptionsRepository = moduleRef.get<typeof Subscription>(
      getModelToken(Subscription)
    )
  })

  describe("execute", () => {
    it("should unsubscribe when token is valid", async () => {
      const token = "valid-token"
      const command = new UnsubscribeCommand(token)
      const mockSubscription = {
        id: "1",
        destroy: jest.fn().mockResolvedValue(true)
      } as never as Subscription

      jest
        .spyOn(subscriptionsRepository, "findOne")
        .mockResolvedValue(mockSubscription)

      await handler.execute(command)

      expect(subscriptionsRepository.findOne).toHaveBeenCalledWith({
        where: { unsubscribeToken: token }
      })
      expect(mockSubscription.destroy).toHaveBeenCalled()
    })

    it("should throw NotFoundException when token is invalid", async () => {
      const token = "invalid-token"
      const command = new UnsubscribeCommand(token)

      jest.spyOn(subscriptionsRepository, "findOne").mockResolvedValue(null)

      await expect(handler.execute(command)).rejects.toThrow(NotFoundException)
    })
  })
})
