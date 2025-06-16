import { Test } from "@nestjs/testing"
import { CommandBus } from "@nestjs/cqrs"
import { SubscriptionsController } from "../../../../src/subscriptions/controllers/subscriptions.controller"
import { CreateSubscriptionCommand } from "../../../../src/subscriptions/commands/impl/create-subscription.command"
import { ConfirmSubscriptionCommand } from "../../../../src/subscriptions/commands/impl/confirm-subscription.command"
import { UnsubscribeCommand } from "../../../../src/subscriptions/commands/impl/unsubscribe.command"
import { commandBusMockFactory } from "../../../mocks/services/cqrs.mock"
import { createSubscriptionDtoMock } from "../../../mocks/dto/create-subscription.dto.mock"

describe("SubscriptionsController", () => {
  let controller: SubscriptionsController
  let commandBus: CommandBus

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [SubscriptionsController],
      providers: [
        {
          provide: CommandBus,
          useValue: commandBusMockFactory()
        }
      ]
    }).compile()

    controller = moduleRef.get<SubscriptionsController>(SubscriptionsController)
    commandBus = moduleRef.get<CommandBus>(CommandBus)
  })

  describe("subscribe", () => {
    it("should execute CreateSubscriptionCommand with correct DTO", async () => {
      await controller.subscribe(createSubscriptionDtoMock)

      expect(commandBus.execute).toHaveBeenCalledWith(
        new CreateSubscriptionCommand(createSubscriptionDtoMock)
      )
    })
  })

  describe("confirm", () => {
    it("should execute ConfirmSubscriptionCommand with correct token", async () => {
      const token = "test-token"

      await controller.confirm(token)

      expect(commandBus.execute).toHaveBeenCalledWith(
        new ConfirmSubscriptionCommand(token)
      )
    })
  })

  describe("unsubscribe", () => {
    it("should execute UnsubscribeCommand with correct token", async () => {
      const token = "unsubscribe-token"

      await controller.unsubscribe(token)

      expect(commandBus.execute).toHaveBeenCalledWith(
        new UnsubscribeCommand(token)
      )
    })
  })
})
