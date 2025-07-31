import { Injectable } from "@nestjs/common"
import { InjectMetric } from "@willsoto/nestjs-prometheus"
import { Counter, Gauge, Histogram } from "prom-client"
import {
  ISchedulerMetricsService,
  SchedulerMetricsType
} from "../../../application/metrics/interfaces/scheduler-metrics.interface"

@Injectable()
export class SchedulerMetricsService implements ISchedulerMetricsService {
  constructor(
    @InjectMetric(SchedulerMetricsType.SCHEDULER_TASKS_TOTAL)
    private schedulerTasksTotal: Counter<string>,
    @InjectMetric(SchedulerMetricsType.SCHEDULER_TASKS_ERRORS)
    private schedulerTasksErrors: Counter<string>,
    @InjectMetric(SchedulerMetricsType.SCHEDULER_TASKS_DURATION)
    private schedulerTasksDuration: Histogram<string>,
    @InjectMetric(SchedulerMetricsType.SCHEDULER_TASKS_IN_PROGRESS)
    private schedulerTasksInProgress: Gauge<string>
  ) {}

  recordTask(taskName: string, duration: number) {
    this.schedulerTasksTotal.inc({ task_name: taskName })
    this.schedulerTasksDuration.observe({ task_name: taskName }, duration)
  }

  recordTaskError(taskName: string) {
    this.schedulerTasksErrors.inc({ task_name: taskName })
  }

  startTask(taskName: string) {
    this.schedulerTasksInProgress.inc({ task_name: taskName })
  }

  endTask(taskName: string) {
    this.schedulerTasksInProgress.dec({ task_name: taskName })
  }
}
