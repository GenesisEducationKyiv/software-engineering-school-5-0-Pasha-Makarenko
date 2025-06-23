import { CreateSubscriptionDto } from "../../../src/subscriptions/dto/create-subscription.dto"
import { Frequency } from "../../../src/subscriptions/models/subscription.model"

export const createSubscriptionDtoMock: CreateSubscriptionDto = {
  email: "email3@example.com",
  city: "City3",
  frequency: Frequency.DAILY
}
