import { ISubscriptionsCommandRepository } from "../../../src/domain/subscriptions/repositories/subscriptions-command.repository.interface"

export const subscriptionsCommandRepositoryMockFactory = () =>
  ({
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }) as ISubscriptionsCommandRepository
