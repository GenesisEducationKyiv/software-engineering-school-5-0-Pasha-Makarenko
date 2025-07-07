import { ISubscriptionsCommandRepository } from "../../../src/domain/subscriptions/repositories/subscriptions-command.repository.interface"

export const subscriptionsCommandRepositoryMockFactory = () =>
  ({
    add: jest.fn(),
    delete: jest.fn()
  }) as ISubscriptionsCommandRepository
