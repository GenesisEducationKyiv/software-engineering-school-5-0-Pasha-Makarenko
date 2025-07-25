import { Injectable } from "@nestjs/common"
import { InjectMetric } from "@willsoto/nestjs-prometheus"
import { Counter } from "prom-client"
import {
  EmailMetricsType,
  IEmailMetricsService
} from "../interfaces/email-metrics.interface"

export const EMAIL_METRICS_SERVICE = "EMAIL_METRICS_SERVICE"

@Injectable()
export class EmailMetricsService implements IEmailMetricsService {
  constructor(
    @InjectMetric(EmailMetricsType.EMAIL_SENT_TOTAL)
    private emailSent: Counter<string>,
    @InjectMetric(EmailMetricsType.EMAIL_FAILED_TOTAL)
    private emailFailed: Counter<string>
  ) {}

  recordEmailSent(emailType: string): void {
    this.emailSent.inc({ email_type: emailType })
  }

  recordEmailFailed(emailType: string): void {
    this.emailFailed.inc({ email_type: emailType })
  }
}
