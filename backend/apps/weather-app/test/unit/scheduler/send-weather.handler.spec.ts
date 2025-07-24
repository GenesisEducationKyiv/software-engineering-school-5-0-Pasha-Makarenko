import { Test } from "@nestjs/testing"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { urlGeneratorServiceMockFactory } from "../../mocks/services/url-generator.service.mock"
import {
  commandBusMockFactory,
  queryBusMockFactory
} from "../../mocks/services/cqrs.mock"
import { SendWeatherHandler } from "../../../src/application/scheduler/commands/handlers/send-weather.handler"
import { SendWeatherCommand } from "../../../src/application/scheduler/commands/impl/send-weather.command"
import { URL_GENERATOR_SERVICE } from "../../../src/application/common/interfaces/url-generator.interfaces"
import { Frequency } from "../../../src/domain/subscriptions/enums/frequency.enum"
import { subscriptionsMock } from "../../mocks/entities/subscription.entity.mock"
import { WEATHER_CONTEXT_MAPPER } from "../../../src/application/notifications/interfaces/weather-context.interface"
import { WeatherContextMapper } from "../../../src/infrastructure/notifications/mapper/weather-context.mapper"

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
          provide: URL_GENERATOR_SERVICE,
          useValue: urlGeneratorServiceMockFactory()
        },
        {
          provide: WEATHER_CONTEXT_MAPPER,
          useValue: new WeatherContextMapper()
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

    await handler.execute(command)

    expect(queryBus.execute).toHaveBeenCalledTimes(
      2 * subscriptionsMock.length + 1
    )
    expect(commandBus.execute).toHaveBeenCalledTimes(subscriptionsMock.length)
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
