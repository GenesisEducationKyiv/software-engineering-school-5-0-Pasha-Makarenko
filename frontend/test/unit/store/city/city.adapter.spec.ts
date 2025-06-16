import { of } from "rxjs"
import { Store } from "@ngrx/store"
import { provideMockStore } from "@ngrx/store/testing"
import { TestBed } from "@angular/core/testing"
import { CityAdapter } from "../../../../src/app/store/city/city.adapter"
import { citiesMock, getCityActionsMock } from "../../../mocks/data/city.mock"

describe("CityAdapter", () => {
  let adapter: CityAdapter
  let store: Store

  const mockCity = citiesMock[0]

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore(), CityAdapter]
    })

    store = TestBed.inject(Store)
    adapter = TestBed.inject(CityAdapter)
  })

  describe("select", () => {
    it("should select city from store", () => {
      jest.spyOn(store, "select").mockReturnValue(of(mockCity))

      let result
      adapter.select().subscribe(city => (result = city))

      expect(store.select).toHaveBeenCalledWith(expect.any(Function))
      expect(result).toEqual(mockCity)
    })
  })

  describe("setCity", () => {
    it("should dispatch setCity action", () => {
      const dispatchSpy = jest.spyOn(store, "dispatch")

      adapter.setCity(mockCity)

      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining(getCityActionsMock(0))
      )
    })
  })
})
