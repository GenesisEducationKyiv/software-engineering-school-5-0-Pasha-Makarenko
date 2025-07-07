import { CreateSubscriptionDto } from "../../../src/application/subscriptions/dto/create-subscription.dto"
import { Frequency } from "../../../src/domain/subscriptions/enums/frequency.enum"

export const createSubscriptionDtoMock: CreateSubscriptionDto = {
  email: "email3@example.com",
  city: "City3",
  frequency: Frequency.DAILY
}
