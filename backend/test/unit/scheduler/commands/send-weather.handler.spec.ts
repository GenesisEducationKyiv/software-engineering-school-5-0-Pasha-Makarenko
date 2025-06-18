import { Test } from "@nestjs/testing"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { SendWeatherHandler } from "../../../../src/scheduler/commands/handlers/send-weather.handler"
import { SendWeatherCommand } from "../../../../src/scheduler/commands/impl/send-weather.command"
import { Frequency } from "../../../../src/subscriptions/models/subscription.model"
import { subscriptionModelsMock } from "../../../mocks/models/subscription.model.mock"
import { weatherDataMock } from "../../../mocks/data/weather.mock"
import {
  commandBusMockFactory,
  queryBusMockFactory
} from "../../../mocks/services/cqrs.mock"
import { ClientUrlGeneratorService } from "../../../../src/url-generator/services/client-url-generator.service"
import { clientUrlGeneratorServiceMockFactory } from "../../../mocks/services/client-url-generator.service.mock"

describe("SendWeatherHandler", () => {
  let handler: SendWeatherHandler
  let queryBus: QueryBus
  let commandBus: CommandBus

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
          provide: ClientUrlGeneratorService,
          useValue: clientUrlGeneratorServiceMockFactory()
        }
      ]
    }).compile()

    handler = moduleRef.get<SendWeatherHandler>(SendWeatherHandler)
    queryBus = moduleRef.get<QueryBus>(QueryBus)
    commandBus = moduleRef.get<CommandBus>(CommandBus)
  })

  it("should process subscriptions and send emails", async () => {
    const frequency = Frequency.DAILY
    const command = new SendWeatherCommand(frequency)

    jest
      .spyOn(queryBus, "execute")
      .mockResolvedValueOnce(subscriptionModelsMock)
      .mockResolvedValue(weatherDataMock)

    await handler.execute(command)

    expect(queryBus.execute).toHaveBeenCalledTimes(
      1 + subscriptionModelsMock.length
    )
    expect(commandBus.execute).toHaveBeenCalledTimes(
      subscriptionModelsMock.length
    )
  })

  it("should handle empty subscriptions", async () => {
    const frequency = Frequency.DAILY
    const command = new SendWeatherCommand(frequency)

    jest.spyOn(queryBus, "execute").mockResolvedValue([])

    await handler.execute(command)

    expect(queryBus.execute).toHaveBeenCalledTimes(1)
    expect(commandBus.execute).not.toHaveBeenCalled()
  })
})
