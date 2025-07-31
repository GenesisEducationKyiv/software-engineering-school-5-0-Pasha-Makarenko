import { Injectable } from "@nestjs/common"
import { InjectMetric } from "@willsoto/nestjs-prometheus"
import { Counter, Gauge, Histogram } from "prom-client"
import {
  ISearchMetricsService,
  SearchMetricsType
} from "../../../application/metrics/interfaces/search-metrics.interface"

@Injectable()
export class SearchMetricsService implements ISearchMetricsService {
  constructor(
    @InjectMetric(SearchMetricsType.SEARCH_REQUESTS_TOTAL)
    private searchRequestsTotal: Counter<string>,
    @InjectMetric(SearchMetricsType.SEARCH_REQUESTS_ERRORS)
    private searchRequestsErrors: Counter<string>,
    @InjectMetric(SearchMetricsType.SEARCH_REQUEST_DURATION)
    private searchRequestDuration: Histogram<string>,
    @InjectMetric(SearchMetricsType.SEARCH_REQUESTS_IN_PROGRESS)
    private searchRequestsInProgress: Gauge<string>
  ) {}

  recordSearchRequest(query: string, duration: number): void {
    this.searchRequestsTotal.inc({ query })
    this.searchRequestDuration.observe({ query }, duration)
  }

  recordSearchRequestError(query: string): void {
    this.searchRequestsErrors.inc({ query })
  }

  startSearchRequest(query: string): void {
    this.searchRequestsInProgress.inc({ query })
  }

  endSearchRequest(query: string): void {
    this.searchRequestsInProgress.dec({ query })
  }
}
