import { of } from "rxjs"
import { TestBed } from "@angular/core/testing"
import { provideMockStore } from "@ngrx/store/testing"
import { provideMockActions } from "@ngrx/effects/testing"
import { Store } from "@ngrx/store"
import * as CityActions from "../../../../src/app/store/city/city.actions"
import { CityEffects } from "../../../../src/app/store/city/city.effects"
import { Actions } from "@ngrx/effects"
import { CookieService } from "ngx-cookie-service"
import { City } from "../../../../src/app/api/search/search.interface"
import { AppState } from "../../../../src/app/store/state.interfaces"
import { citiesMock, getCityActionsMock } from "../../../mocks/data/city.mock"
import { cookieServiceMockFactory } from "../../../mocks/services/cookie.service.mock"

describe("CityEffects", () => {
  let effects: CityEffects
  let actions$: Actions
  let cookieService: jest.Mocked<CookieService>
  let store: Store<AppState>

  const mockCity: City = citiesMock[0]

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CityEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        {
          provide: CookieService,
          useValue: cookieServiceMockFactory()
        }
      ]
    })

    cookieService = TestBed.inject(CookieService) as jest.Mocked<CookieService>
    store = TestBed.inject(Store)
    jest.clearAllMocks()
  })

  describe("loadInitialCity", () => {
    it("should dispatch setCity if cookie exists", () => {
      cookieService.get.mockReturnValue(JSON.stringify(mockCity))
      const dispatchSpy = jest.spyOn(store, "dispatch")

      effects = TestBed.inject(CityEffects)

      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining(getCityActionsMock(0))
      )
    })

    it("should not dispatch if cookie does not exist", () => {
      cookieService.get.mockReturnValue("")
      const dispatchSpy = jest.spyOn(store, "dispatch")

      effects = TestBed.inject(CityEffects)

      expect(dispatchSpy).not.toHaveBeenCalled()
    })
  })

  describe("saveCity$", () => {
    beforeEach(() => {
      effects = TestBed.inject(CityEffects)
    })

    it("should save city to cookie when setCity is dispatched", () => {
      const mockDate = new Date(2025, 6, 15)
      jest.spyOn(global, "Date").mockImplementation(() => mockDate)

      const expectedExpiryDate = new Date(mockDate)
      expectedExpiryDate.setDate(expectedExpiryDate.getDate() + 30)

      actions$ = of(CityActions.setCity({ city: mockCity }))

      effects.saveCity$.subscribe()

      expect(cookieService.set).toHaveBeenCalledWith(
        "selected_city",
        JSON.stringify(mockCity),
        expectedExpiryDate
      )

      jest.restoreAllMocks()
    })

    it("should delete cookie when city is set to null", () => {
      actions$ = of(CityActions.setCity({ city: null as never as City }))

      effects.saveCity$.subscribe()

      expect(cookieService.delete).toHaveBeenCalledWith("selected_city", "/")
    })
  })
})
