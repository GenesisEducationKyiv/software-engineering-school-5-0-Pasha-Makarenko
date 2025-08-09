import {
  makeCounterProvider,
  makeGaugeProvider,
  makeHistogramProvider
} from "@willsoto/nestjs-prometheus"
import { WeatherMetricsType } from "../../../application/metrics/interfaces/weather-metrics.interface"

export const weatherMetricsProviders = [
  makeCounterProvider({
    name: WeatherMetricsType.WEATHER_REQUESTS_TOTAL,
    help: "Total number of weather requests",
    labelNames: ["lat", "lon"]
  }),
  makeCounterProvider({
    name: WeatherMetricsType.WEATHER_REQUESTS_ERRORS,
    help: "Total number of weather request errors",
    labelNames: ["lat", "lon"]
  }),
  makeHistogramProvider({
    name: WeatherMetricsType.WEATHER_REQUEST_DURATION,
    help: "Weather request duration in seconds",
    labelNames: ["lat", "lon"],
    buckets: [0.1, 0.5, 1, 2, 5, 10]
  }),
  makeGaugeProvider({
    name: WeatherMetricsType.WEATHER_REQUESTS_IN_PROGRESS,
    help: "Number of weather requests currently in progress",
    labelNames: ["lat", "lon"]
  })
]
