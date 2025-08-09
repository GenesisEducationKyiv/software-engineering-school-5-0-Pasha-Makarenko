import {
  makeCounterProvider,
  makeGaugeProvider,
  makeHistogramProvider
} from "@willsoto/nestjs-prometheus"
import { SchedulerMetricsType } from "../../../application/metrics/interfaces/scheduler-metrics.interface"

export const schedulerMetricsProviders = [
  makeCounterProvider({
    name: SchedulerMetricsType.SCHEDULER_TASKS_TOTAL,
    help: "Total number of scheduler tasks executed",
    labelNames: ["task_name"]
  }),
  makeCounterProvider({
    name: SchedulerMetricsType.SCHEDULER_TASKS_ERRORS,
    help: "Total number of errors when executing scheduler tasks",
    labelNames: ["task_name"]
  }),
  makeHistogramProvider({
    name: SchedulerMetricsType.SCHEDULER_TASKS_DURATION,
    help: "Scheduler task duration in seconds",
    labelNames: ["task_name"],
    buckets: [0.1, 0.5, 1, 2, 5, 10]
  }),
  makeGaugeProvider({
    name: SchedulerMetricsType.SCHEDULER_TASKS_IN_PROGRESS,
    help: "Number of scheduler tasks currently in progress",
    labelNames: ["task_name"]
  })
]
