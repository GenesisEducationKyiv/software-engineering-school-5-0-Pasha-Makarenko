import { ISubscriptionsCommandRepository } from "../../../src/subscriptions/interfaces/subscriptions-command.repository.interface"

export const subscriptionsCommandRepositoryMockFactory = () =>
  ({
    create: jest.fn(),
    confirmByToken: jest.fn(),
    unsubscribeByToken: jest.fn()
  }) as ISubscriptionsCommandRepository
