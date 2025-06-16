import { CreateSubscriptionDto } from "../../../src/subscriptions/dto/create-subscription.dto"
import { Frequency } from "../../../src/subscriptions/models/subscription.model"

export const createSubscriptionDtoMock: CreateSubscriptionDto = {
  email: "test@example.com",
  city: "London",
  frequency: Frequency.DAILY
}
