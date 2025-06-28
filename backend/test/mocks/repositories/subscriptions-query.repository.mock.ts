import { ISubscriptionsQueryRepository } from "../../../src/subscriptions/interfaces/subscriptions-query.repository.interface"

export const subscriptionsQueryRepositoryMockFactory = () =>
  ({
    findByEmailAndCity: jest.fn(),
    findByConfirmationToken: jest.fn(),
    findByUnsubscribeToken: jest.fn(),
    findAllActiveByFrequency: jest.fn()
  }) as ISubscriptionsQueryRepository
