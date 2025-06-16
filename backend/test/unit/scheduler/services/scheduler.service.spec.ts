import { Test } from "@nestjs/testing"
import { CommandBus } from "@nestjs/cqrs"
import { SchedulerService } from "../../../../src/scheduler/services/scheduler.service"
import { SendWeatherCommand } from "../../../../src/scheduler/commands/impl/send-weather.command"
import { Frequency } from "../../../../src/subscriptions/models/subscription.model"
import { commandBusMockFactory } from "../../../mocks/services/cqrs.mock"

describe("SchedulerService", () => {
  let service: SchedulerService
  let commandBus: CommandBus

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SchedulerService,
        {
          provide: CommandBus,
          useValue: commandBusMockFactory()
        }
      ]
    }).compile()

    service = moduleRef.get<SchedulerService>(SchedulerService)
    commandBus = moduleRef.get<CommandBus>(CommandBus)
  })

  describe("sendWeatherHourly", () => {
    it("should execute SendWeatherCommand with HOURLY frequency", async () => {
      await service.sendWeatherHourly()
      expect(commandBus.execute).toHaveBeenCalledWith(
        new SendWeatherCommand(Frequency.HOURLY)
      )
    })
  })

  describe("sendWeatherDaily", () => {
    it("should execute SendWeatherCommand with DAILY frequency", async () => {
      await service.sendWeatherDaily()
      expect(commandBus.execute).toHaveBeenCalledWith(
        new SendWeatherCommand(Frequency.DAILY)
      )
    })
  })
})
