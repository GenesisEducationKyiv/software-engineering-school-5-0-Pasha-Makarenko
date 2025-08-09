import { Injectable } from "@nestjs/common"
import { InjectMetric } from "@willsoto/nestjs-prometheus"
import { Counter, Gauge, Histogram } from "prom-client"
import {
  IWeatherMetricsService,
  WeatherMetricsType
} from "../../../application/metrics/interfaces/weather-metrics.interface"

@Injectable()
export class WeatherMetricsService implements IWeatherMetricsService {
  constructor(
    @InjectMetric(WeatherMetricsType.WEATHER_REQUESTS_TOTAL)
    private weatherRequestsTotal: Counter<string>,
    @InjectMetric(WeatherMetricsType.WEATHER_REQUESTS_ERRORS)
    private weatherRequestsErrors: Counter<string>,
    @InjectMetric(WeatherMetricsType.WEATHER_REQUEST_DURATION)
    private weatherRequestDuration: Histogram<string>,
    @InjectMetric(WeatherMetricsType.WEATHER_REQUESTS_IN_PROGRESS)
    private weatherRequestsInProgress: Gauge<string>
  ) {}

  recordWeatherRequest(lat: number, lon: number, duration: number): void {
    this.weatherRequestsTotal.inc({ lat: lat.toString(), lon: lon.toString() })
    this.weatherRequestDuration.observe(
      { lat: lat.toString(), lon: lon.toString() },
      duration
    )
  }

  recordWeatherRequestError(lat: number, lon: number): void {
    this.weatherRequestsErrors.inc({ lat: lat.toString(), lon: lon.toString() })
  }

  startWeatherRequest(lat: number, lon: number): void {
    this.weatherRequestsInProgress.inc({
      lat: lat.toString(),
      lon: lon.toString()
    })
  }

  endWeatherRequest(lat: number, lon: number): void {
    this.weatherRequestsInProgress.dec({
      lat: lat.toString(),
      lon: lon.toString()
    })
  }
}
