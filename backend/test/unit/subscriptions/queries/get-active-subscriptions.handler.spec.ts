import { Test } from "@nestjs/testing"
import { getModelToken } from "@nestjs/sequelize"
import { GetActiveSubscriptionsHandler } from "../../../../src/subscriptions/queries/handlers/get-active-subscriptions.handler"
import { GetActiveSubscriptionsQuery } from "../../../../src/subscriptions/queries/impl/get-active-subscriptions.query"
import { Subscription } from "../../../../src/subscriptions/models/subscription.model"
import { subscriptionModelsMock } from "../../../mocks/models/subscription.model.mock"

describe("GetActiveSubscriptionsHandler", () => {
  let handler: GetActiveSubscriptionsHandler
  let subscriptionsRepository: typeof Subscription

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetActiveSubscriptionsHandler,
        {
          provide: getModelToken(Subscription),
          useValue: {
            findAll: jest.fn()
          }
        }
      ]
    }).compile()

    handler = moduleRef.get<GetActiveSubscriptionsHandler>(
      GetActiveSubscriptionsHandler
    )
    subscriptionsRepository = moduleRef.get<typeof Subscription>(
      getModelToken(Subscription)
    )
  })

  describe("execute", () => {
    it("should return active subscriptions with additional where clause", async () => {
      const where = { isConfirmed: true }
      const query = new GetActiveSubscriptionsQuery(where)
      const mockSubscriptions = subscriptionModelsMock

      jest
        .spyOn(subscriptionsRepository, "findAll")
        .mockResolvedValue(mockSubscriptions)

      const result = await handler.execute(query)

      expect(subscriptionsRepository.findAll).toHaveBeenCalledWith({
        where: {
          ...where,
          isConfirmed: true
        }
      })
      expect(result).toEqual(mockSubscriptions)
    })
  })
})
