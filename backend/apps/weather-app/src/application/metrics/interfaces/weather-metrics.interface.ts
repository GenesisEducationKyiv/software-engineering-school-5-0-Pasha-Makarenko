export const WEATHER_METRICS_SERVICE = "WEATHER_METRICS_SERVICE"

export enum WeatherMetricsType {
  WEATHER_REQUESTS_TOTAL = "weather_requests_total",
  WEATHER_REQUESTS_ERRORS = "weather_requests_errors",
  WEATHER_REQUEST_DURATION = "weather_request_duration_seconds",
  WEATHER_REQUESTS_IN_PROGRESS = "weather_requests_in_progress"
}

export interface IWeatherMetricsService {
  recordWeatherRequest(lat: number, lon: number, duration: number): void

  recordWeatherRequestError(lat: number, lon: number): void

  startWeatherRequest(lat: number, lon: number): void

  endWeatherRequest(lat: number, lon: number): void
}
