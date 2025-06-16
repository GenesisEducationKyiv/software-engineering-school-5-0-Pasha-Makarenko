import { Test } from "@nestjs/testing"
import { QueryBus } from "@nestjs/cqrs"
import { SearchController } from "../../../../src/search/controllers/search.controller"
import { GetCitiesQuery } from "../../../../src/search/queries/impl/get-cities.query"

describe("SearchController", () => {
  let controller: SearchController
  let queryBus: QueryBus

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn()
          }
        }
      ]
    }).compile()

    controller = moduleRef.get<SearchController>(SearchController)
    queryBus = moduleRef.get<QueryBus>(QueryBus)
  })

  describe("search", () => {
    it("should call query bus with correct parameters", async () => {
      const city = "London"
      const expectedResult = [
        { id: 1, name: "London" },
        { id: 2, name: "Londonville" }
      ]

      jest.spyOn(queryBus, "execute").mockResolvedValue(expectedResult)

      const result = await controller.search(city)

      expect(queryBus.execute).toHaveBeenCalledWith(new GetCitiesQuery(city))
      expect(result).toEqual(expectedResult)
    })

    it("should handle empty city parameter", async () => {
      const city = ""
      const expectedResult = []

      jest.spyOn(queryBus, "execute").mockResolvedValue(expectedResult)

      const result = await controller.search(city)

      expect(queryBus.execute).toHaveBeenCalledWith(new GetCitiesQuery(city))
      expect(result).toEqual(expectedResult)
    })
  })
})
