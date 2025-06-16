import { Test } from "@nestjs/testing"
import { CommandBus } from "@nestjs/cqrs"
import { SubscriptionCreatedHandler } from "../../../../src/subscriptions/events/handlers/subscription-created.handler"
import { UrlGeneratorService } from "../../../../src/url-generator/services/url-generator.service"
import { SubscriptionCreatedEvent } from "../../../../src/subscriptions/events/impl/subscription-created.event"
import { SendMailCommand } from "../../../../src/mail/commands/impl/send-mail.command"
import {
  confirmUrlMock,
  urlGeneratorServiceMockFactory
} from "../../../mocks/services/url-generator.service.mock"
import { commandBusMockFactory } from "../../../mocks/services/cqrs.mock"
import { subscriptionModelsMock } from "../../../mocks/models/subscription.model.mock"

describe("SubscriptionCreatedHandler", () => {
  let handler: SubscriptionCreatedHandler
  let urlGeneratorService: UrlGeneratorService
  let commandBus: CommandBus

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SubscriptionCreatedHandler,
        {
          provide: UrlGeneratorService,
          useValue: urlGeneratorServiceMockFactory()
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
    urlGeneratorService =
      moduleRef.get<UrlGeneratorService>(UrlGeneratorService)
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
            confirmUrl: `${confirmUrlMock}${mockSubscription.confirmationToken}`
          }
        })
      )
    })
  })
})
