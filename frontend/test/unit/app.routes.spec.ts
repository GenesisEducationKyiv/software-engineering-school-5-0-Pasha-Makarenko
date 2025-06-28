import { fakeAsync, TestBed, tick } from "@angular/core/testing"
import { Router } from "@angular/router"
import { RouterTestingModule } from "@angular/router/testing"
import { routes } from "../../src/app/app.routes"
import { SubscriptionsService } from "../../src/app/api/subscriptions/subscriptions.service"
import { HttpClientTestingModule } from "@angular/common/http/testing"

describe("App Routes", () => {
  let router: Router
  let subscriptionsService: SubscriptionsService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule
      ],
      providers: [SubscriptionsService]
    })

    router = TestBed.inject(Router)
    subscriptionsService = TestBed.inject(SubscriptionsService)
  })

  it("should handle route guards and redirects", fakeAsync(() => {
    const spy = jest.spyOn(subscriptionsService, "confirm")
    router.navigate(["/confirm/invalid-token"])
    tick()
    expect(spy).toHaveBeenCalledWith("invalid-token")
    expect(router.url).toBe("/")
  }))
})
