import { ISubscriptionsMetricsService } from "../../../src/application/metrics/interfaces/subscriptions-metrics.interface"

export const subscriptionsMetricsServiceMockFactory = () =>
  ({
    recordSubscriptionCreated: jest.fn(),
    recordSubscriptionCreatedError: jest.fn(),
    recordSubscriptionConfirmed: jest.fn(),
    recordSubscriptionConfirmedError: jest.fn(),
    recordSubscriptionUnsubscribed: jest.fn(),
    recordSubscriptionUnsubscribedError: jest.fn()
  }) as never as ISubscriptionsMetricsService
