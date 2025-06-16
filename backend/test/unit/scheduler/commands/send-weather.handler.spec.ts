import { Test } from "@nestjs/testing"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { UrlGeneratorService } from "../../../../src/url-generator/services/url-generator.service"
import { SendWeatherHandler } from "../../../../src/scheduler/commands/handlers/send-weather.handler"
import { Frequency } from "../../../../src/subscriptions/models/subscription.model"
import { SendWeatherCommand } from "../../../../src/scheduler/commands/impl/send-weather.command"
import { GetActiveSubscriptionsQuery } from "../../../../src/subscriptions/queries/impl/get-active-subscriptions.query"
import { GetWeatherQuery } from "../../../../src/weather/queries/impl/get-weather.query"
import { SendMailCommand } from "../../../../src/mail/commands/impl/send-mail.command"
import {
  commandBusMockFactory,
  queryBusMockFactory
} from "../../../mocks/services/cqrs.mock"
import {
  unsubscribeUrlMock,
  urlGeneratorServiceMockFactory
} from "../../../mocks/services/url-generator.service.mock"
import { subscriptionModelsMock } from "../../../mocks/models/subscription.model.mock"
import { weatherDataMock } from "../../../mocks/data/weather.mock"

describe("SendWeatherHandler", () => {
  let handler: SendWeatherHandler
  let queryBus: QueryBus
  let commandBus: CommandBus
  let urlGeneratorService: UrlGeneratorService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SendWeatherHandler,
        {
          provide: QueryBus,
          useValue: queryBusMockFactory()
        },
        {
          provide: CommandBus,
          useValue: commandBusMockFactory()
        },
        {
          provide: UrlGeneratorService,
          useValue: urlGeneratorServiceMockFactory()
        }
      ]
    }).compile()

    handler = moduleRef.get<SendWeatherHandler>(SendWeatherHandler)
    queryBus = moduleRef.get<QueryBus>(QueryBus)
    commandBus = moduleRef.get<CommandBus>(CommandBus)
    urlGeneratorService =
      moduleRef.get<UrlGeneratorService>(UrlGeneratorService)
  })

  describe("execute", () => {
    it("should process subscriptions and send emails successfully", async () => {
      const frequency = Frequency.DAILY
      const command = new SendWeatherCommand(frequency)

      const mockSubscriptions = subscriptionModelsMock

      await handler.execute(command)

      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetActiveSubscriptionsQuery({ frequency })
      )

      mockSubscriptions.forEach(sub => {
        expect(queryBus.execute).toHaveBeenCalledWith(
          new GetWeatherQuery({ city: sub.city, days: "1" })
        )
        expect(urlGeneratorService.unsubscribeUrl).toHaveBeenCalledWith(
          sub.unsubscribeToken
        )
        expect(commandBus.execute).toHaveBeenCalledWith(
          new SendMailCommand({
            emails: [sub.email],
            subject: "Weather",
            template: "weather",
            context: {
              unsubscribeUrl: `${unsubscribeUrlMock}${sub.unsubscribeToken}`,
              weather: weatherDataMock
            }
          })
        )
      })
    })

    it("should handle empty subscriptions list", async () => {
      const frequency = Frequency.DAILY
      const command = new SendWeatherCommand(frequency)

      jest.spyOn(queryBus, "execute").mockResolvedValue([])

      await handler.execute(command)

      expect(queryBus.execute).toHaveBeenCalledTimes(1)
      expect(commandBus.execute).not.toHaveBeenCalled()
    })
  })
})
