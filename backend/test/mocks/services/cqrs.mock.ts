import { CommandBus, EventBus, QueryBus } from "@nestjs/cqrs"
import { GetActiveSubscriptionsQuery } from "../../../src/subscriptions/queries/impl/get-active-subscriptions.query"
import { GetWeatherQuery } from "../../../src/weather/queries/impl/get-weather.query"
import { GetWeatherQueryHandler } from "../handlers/get-weather-handler.mock"
import { GetActiveSubscriptionsHandler } from "../handlers/get-active-subscriptions-handler.mock"
import { GetCitiesQuery } from "../../../src/search/queries/impl/get-cities.query"
import { GetCitiesQueryHandler } from "../handlers/get-cities-handler.mock"

export interface QueryHandler<TQuery, TResult> {
  handle(query: TQuery): Promise<TResult>
}

export class QueryBusMock {
  private handlers = new Map<object, QueryHandler<unknown, unknown>>()

  registerHandler<TQuery, TResult>(
    queryType: object,
    handler: QueryHandler<TQuery, TResult>
  ) {
    this.handlers.set(queryType, handler)
    return this
  }

  execute<T extends object>(query: T): Promise<unknown> {
    const handler = this.handlers.get(query.constructor)
    if (!handler) {
      return Promise.resolve(null)
    }
    return handler.handle(query)
  }
}

const queryBusMock = new QueryBusMock()
  .registerHandler(
    GetActiveSubscriptionsQuery,
    new GetActiveSubscriptionsHandler()
  )
  .registerHandler(GetCitiesQuery, new GetCitiesQueryHandler())
  .registerHandler(GetWeatherQuery, new GetWeatherQueryHandler())

export const queryBusMockFactory = () =>
  ({
    execute: jest.fn((query: object) => queryBusMock.execute(query))
  }) as never as QueryBus

export const commandBusMockFactory = () =>
  ({
    execute: jest.fn()
  }) as never as CommandBus

export const eventBusMockFactory = () =>
  ({
    publish: jest.fn()
  }) as never as EventBus
