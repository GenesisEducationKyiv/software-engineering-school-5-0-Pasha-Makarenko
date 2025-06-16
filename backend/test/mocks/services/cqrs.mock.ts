import { CommandBus, EventBus, QueryBus } from "@nestjs/cqrs"
import { GetActiveSubscriptionsQuery } from "../../../src/subscriptions/queries/impl/get-active-subscriptions.query"
import { GetWeatherQuery } from "../../../src/weather/queries/impl/get-weather.query"
import { subscriptionModelsMock } from "../models/subscription.model.mock"
import { weatherDataMock } from "../data/weather.mock"

export const queryBusMockFactory = () =>
  ({
    execute: jest.fn((query: any) => {
      if (query instanceof GetActiveSubscriptionsQuery) {
        return Promise.resolve(subscriptionModelsMock)
      } else if (query instanceof GetWeatherQuery) {
        return Promise.resolve(weatherDataMock)
      }
      return Promise.resolve(null)
    })
  }) as never as QueryBus

export const commandBusMockFactory = () =>
  ({
    execute: jest.fn()
  }) as never as CommandBus

export const eventBusMockFactory = () =>
  ({
    publish: jest.fn()
  }) as never as EventBus
