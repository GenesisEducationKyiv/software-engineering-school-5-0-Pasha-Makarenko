export const SCHEDULER_METRICS_SERVICE = "SCHEDULER_METRICS_SERVICE"

export enum SchedulerMetricsType {
  SCHEDULER_TASKS_TOTAL = "scheduler_tasks_total",
  SCHEDULER_TASKS_ERRORS = "scheduler_tasks_errors",
  SCHEDULER_TASKS_DURATION = "scheduler_tasks_duration_seconds",
  SCHEDULER_TASKS_IN_PROGRESS = "scheduler_tasks_in_progress"
}

export interface ISchedulerMetricsService {
  recordTask(taskName: string, duration: number): void

  recordTaskError(taskName: string): void

  startTask(taskName: string): void

  endTask(taskName: string): void
}
