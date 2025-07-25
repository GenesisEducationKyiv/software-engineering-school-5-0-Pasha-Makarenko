import { Subscription } from "../../../src/domain/subscriptions/entities/subscription.entity"
import { Frequency } from "../../../src/domain/subscriptions/enums/frequency.enum"

export const subscriptionsMock: Subscription[] = [
  Subscription.create(
    "subscription1",
    "email1@example.com",
    "City1",
    Frequency.HOURLY,
    "confirmationToken1",
    "unsubscribeToken1"
  ),
  Subscription.create(
    "subscription2",
    "email2@example.com",
    "City2",
    Frequency.DAILY,
    "confirmationToken2",
    "unsubscribeToken2"
  ),
  Subscription.create(
    "subscription3",
    "email3@example.com",
    "City3",
    Frequency.HOURLY,
    "confirmationToken3",
    "unsubscribeToken3"
  ),
  Subscription.create(
    "subscription4",
    "email4@example.com",
    "City4",
    Frequency.DAILY,
    "confirmationToken4",
    "unsubscribeToken4"
  )
]

subscriptionsMock[0].confirm()
subscriptionsMock[1].confirm()
