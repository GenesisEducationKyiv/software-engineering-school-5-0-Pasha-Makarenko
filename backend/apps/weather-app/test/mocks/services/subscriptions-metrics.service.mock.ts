import { ISubscriptionsMetricsService } from "../../../src/application/metrics/interfaces/subscriptions-metrics.interface"

export const subscriptionsMetricsServiceMockFactory = () =>
  ({
    recordSubscriptionCreated: jest.fn(),
    recordSubscriptionConfirmed: jest.fn(),
    recordSubscriptionUnsubscribed: jest.fn()
  }) as never as ISubscriptionsMetricsService
