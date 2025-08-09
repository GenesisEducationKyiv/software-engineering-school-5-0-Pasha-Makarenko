export const SEARCH_METRICS_SERVICE = "SEARCH_METRICS_SERVICE"

export enum SearchMetricsType {
  SEARCH_REQUESTS_TOTAL = "search_requests_total",
  SEARCH_REQUESTS_ERRORS = "search_requests_errors",
  SEARCH_REQUEST_DURATION = "search_request_duration_seconds",
  SEARCH_REQUESTS_IN_PROGRESS = "search_requests_in_progress"
}

export interface ISearchMetricsService {
  recordSearchRequest(query: string, duration: number): void

  recordSearchRequestError(query: string): void

  startSearchRequest(query: string): void

  endSearchRequest(query: string): void
}
