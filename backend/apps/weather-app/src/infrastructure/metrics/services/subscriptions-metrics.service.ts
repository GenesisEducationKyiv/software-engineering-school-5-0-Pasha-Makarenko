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
    @InjectMetric(SubscriptionsMetricsType.SUBSCRIPTIONS_TOTAL)
    private subscriptionsTotal: Counter<string>,
    @InjectMetric(SubscriptionsMetricsType.SUBSCRIPTIONS_CONFIRMED)
    private subscriptionsActive: Counter<string>,
    @InjectMetric(SubscriptionsMetricsType.SUBSCRIPTIONS_UNSUBSCRIBED)
    private subscriptionsInactive: Counter<string>
  ) {}

  recordSubscriptionCreated(city: string, frequency: Frequency): void {
    this.subscriptionsTotal.inc({ city, frequency })
  }

  recordSubscriptionConfirmed(city: string, frequency: Frequency): void {
    this.subscriptionsActive.inc({ city, frequency })
  }

  recordSubscriptionUnsubscribed(city: string, frequency: Frequency): void {
    this.subscriptionsInactive.inc({ city, frequency })
  }
}
