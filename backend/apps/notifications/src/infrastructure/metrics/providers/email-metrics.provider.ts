import { makeCounterProvider } from "@willsoto/nestjs-prometheus"
import { EmailMetricsType } from "../interfaces/email-metrics.interface"

export const emailMetricsProviders = [
  makeCounterProvider({
    name: EmailMetricsType.EMAIL_SENT_TOTAL,
    help: "Total number of emails sent",
    labelNames: ["email_type"]
  }),
  makeCounterProvider({
    name: EmailMetricsType.EMAIL_FAILED_TOTAL,
    help: "Total number of emails failed",
    labelNames: ["email_type", "error"]
  })
]
