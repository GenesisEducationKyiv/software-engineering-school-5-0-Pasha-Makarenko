import { TestBed } from "@angular/core/testing"
import { provideMockActions } from "@ngrx/effects/testing"
import { of } from "rxjs"
import { CityEffects } from "../../../../src/app/store/city/city.effects"
import { CookieService } from "ngx-cookie-service"
import { citiesMock } from "../../../mocks/data/city.mock"
import { cookieServiceMockFactory } from "../../../mocks/services/cookie.service.mock"
import { provideMockStore } from "@ngrx/store/testing"
import * as CityActions from "../../../../src/app/store/city/city.actions"

describe("CityEffects", () => {
  let effects: CityEffects
  let cookieService: jest.Mocked<CookieService>

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CityEffects,
        provideMockActions(() =>
          of(CityActions.setCity({ city: citiesMock[0] }))
        ),
        provideMockStore(),
        {
          provide: CookieService,
          useValue: cookieServiceMockFactory()
        }
      ]
    })

    cookieService = TestBed.inject(CookieService) as jest.Mocked<CookieService>
    effects = TestBed.inject(CityEffects)
  })

  it("should handle cookie operations for city persistence", () => {
    effects.saveCity$.subscribe()

    expect(cookieService.set).toHaveBeenCalledWith(
      "selected_city",
      JSON.stringify(citiesMock[0]),
      expect.any(Date)
    )
  })
})
