import { SubscribeDto } from "../../../src/app/api/subscriptions/dto/subscribe.dto"
import { Frequency } from "../../../src/app/api/subscriptions/subscriptions.interface"

export const subscribeDtoMock: SubscribeDto = {
  email: "test@test.com",
  city: "London",
  frequency: Frequency.DAILY
}

export const confirmTokenMock = "test-confirm-token"
export const unsubscribeTokenMock = "test-unsubscribe-token"
