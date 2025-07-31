import { Injectable } from "@nestjs/common"
import {
  ISubscriptionsMetricsService,
  SubscriptionsMetricsType
} from "../../../application/metrics/interfaces/subscriptions-metrics.interface"
import { InjectMetric } from "@willsoto/nestjs-prometheus"
import { Counter } from "prom-client"
import { Frequency } from "../../../domain/subscriptions/enums/frequency.enum"

@Injectable()
export class SubscriptionsMetricsService
  implements ISubscriptionsMetricsService
{
  constructor(
    @InjectMetric(SubscriptionsMetricsType.SUBSCRIPTIONS_CREATED_TOTAL)
    private subscriptionsTotal: Counter<string>,
    @InjectMetric(SubscriptionsMetricsType.SUBSCRIPTIONS_CREATED_ERRORS)
    private subscriptionsCreatedErrors: Counter<string>,
    @InjectMetric(SubscriptionsMetricsType.SUBSCRIPTIONS_CONFIRMED_TOTAL)
    private subscriptionsActive: Counter<string>,
    @InjectMetric(SubscriptionsMetricsType.SUBSCRIPTIONS_CONFIRMED_ERRORS)
    private subscriptionsConfirmedErrors: Counter<string>,
    @InjectMetric(SubscriptionsMetricsType.SUBSCRIPTIONS_UNSUBSCRIBED_TOTAL)
    private subscriptionsInactive: Counter<string>,
    @InjectMetric(SubscriptionsMetricsType.SUBSCRIPTIONS_UNSUBSCRIBED_ERRORS)
    private subscriptionsUnsubscribedErrors: Counter<string>
  ) {}

  recordSubscriptionCreated(city: string, frequency: Frequency) {
    this.subscriptionsTotal.inc({ city, frequency })
  }

  recordSubscriptionCreatedError(city: string, frequency: Frequency) {
    this.subscriptionsCreatedErrors.inc({ city, frequency })
  }

  recordSubscriptionConfirmed(city: string, frequency: Frequency) {
    this.subscriptionsActive.inc({ city, frequency })
  }

  recordSubscriptionConfirmedError(city: string, frequency: Frequency) {
    this.subscriptionsConfirmedErrors.inc({ city, frequency })
  }

  recordSubscriptionUnsubscribed(city: string, frequency: Frequency) {
    this.subscriptionsInactive.inc({ city, frequency })
  }

  recordSubscriptionUnsubscribedError(city: string, frequency: Frequency) {
    this.subscriptionsUnsubscribedErrors.inc({ city, frequency })
  }
}
