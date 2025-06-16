import { Test } from "@nestjs/testing"
import { WeatherController } from "../../../../src/weather/controllers/weather.controller"
import { QueryBus } from "@nestjs/cqrs"
import { WeatherQueryDto } from "../../../../src/weather/dto/weather-query.dto"
import { GetWeatherQuery } from "../../../../src/weather/queries/impl/get-weather.query"
import { queryBusMockFactory } from "../../../mocks/services/cqrs.mock"

describe("WeatherController", () => {
  let controller: WeatherController
  let queryBus: QueryBus

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [
        {
          provide: QueryBus,
          useValue: queryBusMockFactory()
        }
      ]
    }).compile()

    controller = moduleRef.get<WeatherController>(WeatherController)
    queryBus = moduleRef.get<QueryBus>(QueryBus)
  })

  describe("weather", () => {
    it("should call query bus with correct parameters", async () => {
      const dto: WeatherQueryDto = {
        city: "London",
        days: "3"
      }

      const expectedResult = {
        /* mock weather data */
      }

      jest.spyOn(queryBus, "execute").mockResolvedValue(expectedResult)

      const result = await controller.weather(dto)

      expect(queryBus.execute).toHaveBeenCalledWith(new GetWeatherQuery(dto))
      expect(result).toEqual(expectedResult)
    })
  })
})
