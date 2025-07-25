import { EmailMetricsService } from "../../../src/infrastructure/metrics/services/email-metrics.service"

export const emailMetricsServiceMockFactory = () =>
  ({
    recordEmailSent: jest.fn(),
    recordEmailFailed: jest.fn()
  }) as never as EmailMetricsService
