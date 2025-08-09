import { ISchedulerMetricsService } from "../../../application/metrics/interfaces/scheduler-metrics.interface"

export function TrackSchedulerMetrics(taskName: string): MethodDecorator {
  return (
    _target: unknown,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: unknown[]) {
      const schedulerMetricsService: ISchedulerMetricsService =
        this.schedulerMetricsService

      const startTime = Date.now()
      schedulerMetricsService.startTask(taskName)
      try {
        const result = await originalMethod.apply(this, args)
        const endTime = Date.now()
        const duration = endTime - startTime

        schedulerMetricsService.recordTask(taskName, duration / 1000)
        return result
      } catch (error) {
        schedulerMetricsService.recordTaskError(taskName)
        throw error
      } finally {
        schedulerMetricsService.endTask(taskName)
      }
    }

    return descriptor
  }
}
