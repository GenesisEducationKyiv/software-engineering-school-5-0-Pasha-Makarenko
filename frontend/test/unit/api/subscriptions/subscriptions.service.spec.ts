import { TestBed } from "@angular/core/testing"
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing"
import { SubscriptionsService } from "../../../../src/app/api/subscriptions/subscriptions.service"
import { ENDPOINTS } from "../../../../src/app/consts/endpoints"
import { subscribeDtoMock } from "../../../mocks/data/subscriptions.mock"

describe("SubscriptionsService", () => {
  let service: SubscriptionsService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SubscriptionsService]
    })

    service = TestBed.inject(SubscriptionsService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  it("should handle subscription errors", () => {
    const errorResponse = { status: 500, statusText: "Server Error" }

    service.subscribe(subscribeDtoMock).subscribe({
      error: err => {
        expect(err.status).toBe(500)
      }
    })

    const req = httpMock.expectOne(ENDPOINTS.subscribe)
    req.flush(null, errorResponse)
  })
})
