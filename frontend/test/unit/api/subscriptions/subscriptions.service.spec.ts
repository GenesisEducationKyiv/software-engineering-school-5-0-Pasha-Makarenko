import { TestBed } from "@angular/core/testing"
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing"
import { SubscriptionsService } from "../../../../src/app/api/subscriptions/subscriptions.service"
import { ENDPOINTS } from "../../../../src/app/consts/endpoints"
import {
  confirmTokenMock,
  subscribeDtoMock,
  unsubscribeTokenMock
} from "../../../mocks/data/subscriptions.mock"

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

  afterEach(() => {
    httpMock.verify()
  })

  it("should be created", () => {
    expect(service).toBeTruthy()
  })

  it("should subscribe", () => {
    service.subscribe(subscribeDtoMock).subscribe()

    const req = httpMock.expectOne(ENDPOINTS.subscribe)
    expect(req.request.method).toBe("POST")
    expect(req.request.body).toEqual(subscribeDtoMock)
  })

  it("should confirm subscription", () => {
    service.confirm(confirmTokenMock).subscribe()

    const req = httpMock.expectOne(ENDPOINTS.confirm(confirmTokenMock))
    expect(req.request.method).toBe("POST")
  })

  it("should unsubscribe", () => {
    service.unsubscribe(unsubscribeTokenMock).subscribe()

    const req = httpMock.expectOne(ENDPOINTS.unsubscribe(unsubscribeTokenMock))
    expect(req.request.method).toBe("POST")
  })
})
