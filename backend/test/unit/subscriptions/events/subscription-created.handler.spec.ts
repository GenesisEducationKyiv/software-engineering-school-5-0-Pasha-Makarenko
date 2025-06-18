import { Test } from "@nestjs/testing"
import { CommandBus } from "@nestjs/cqrs"
import { SubscriptionCreatedHandler } from "../../../../src/subscriptions/events/handlers/subscription-created.handler"
import { ClientUrlGeneratorService } from "../../../../src/url-generator/services/client-url-generator.service"
import { SubscriptionCreatedEvent } from "../../../../src/subscriptions/events/impl/subscription-created.event"
import { SendMailCommand } from "../../../../src/mail/commands/impl/send-mail.command"
import {
  clientUrlGeneratorServiceMockFactory,
  confirmUrlMock
} from "../../../mocks/services/client-url-generator.service.mock"
import { commandBusMockFactory } from "../../../mocks/services/cqrs.mock"
import { subscriptionModelsMock } from "../../../mocks/models/subscription.model.mock"

describe("SubscriptionCreatedHandler", () => {
  let handler: SubscriptionCreatedHandler
  let urlGeneratorService: ClientUrlGeneratorService
  let commandBus: CommandBus

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SubscriptionCreatedHandler,
        {
          provide: ClientUrlGeneratorService,
          useValue: clientUrlGeneratorServiceMockFactory()
        },
        {
          provide: CommandBus,
          useValue: commandBusMockFactory()
        }
      ]
    }).compile()

    handler = moduleRef.get<SubscriptionCreatedHandler>(
      SubscriptionCreatedHandler
    )
    urlGeneratorService = moduleRef.get<ClientUrlGeneratorService>(
      ClientUrlGeneratorService
    )
    commandBus = moduleRef.get<CommandBus>(CommandBus)
  })

  describe("handle", () => {
    it("should send confirmation email with correct parameters", async () => {
      const mockSubscription = subscriptionModelsMock[0]

      jest.spyOn(commandBus, "execute").mockResolvedValue(true)

      const event = new SubscriptionCreatedEvent(mockSubscription)
      await handler.handle(event)

      expect(urlGeneratorService.confirmUrl).toHaveBeenCalledWith(
        mockSubscription.confirmationToken
      )
      expect(commandBus.execute).toHaveBeenCalledWith(
        new SendMailCommand({
          emails: [mockSubscription.email],
          subject: "Confirmation",
          template: "confirm",
          context: {
            confirmUrl: confirmUrlMock(mockSubscription.confirmationToken)
          }
        })
      )
    })
  })
})
