import {
  Frequency,
  Subscription
} from "../../../src/subscriptions/models/subscription.model"

export const subscriptionModelsMock = [
  {
    id: "subscription1",
    email: "email1@example.com",
    city: "City1",
    frequency: Frequency.HOURLY,
    isConfirmed: true,
    confirmationToken: "confirmationToken1",
    unsubscribeToken: "unsubscribeToken1"
  },
  {
    id: "subscription2",
    email: "email2@example.com",
    city: "City2",
    frequency: Frequency.DAILY,
    isConfirmed: true,
    confirmationToken: "confirmationToken2",
    unsubscribeToken: "unsubscribeToken2"
  },
  {
    id: "subscription3",
    email: "email3@example.com",
    city: "City3",
    frequency: Frequency.HOURLY,
    isConfirmed: false,
    confirmationToken: "confirmationToken3",
    unsubscribeToken: "unsubscribeToken3"
  },
  {
    id: "subscription4",
    email: "email4@example.com",
    city: "City4",
    frequency: Frequency.DAILY,
    isConfirmed: false,
    confirmationToken: "confirmationToken4",
    unsubscribeToken: "unsubscribeToken4"
  }
] as Subscription[]
