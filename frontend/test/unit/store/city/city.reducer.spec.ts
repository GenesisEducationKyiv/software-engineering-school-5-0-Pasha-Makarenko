import * as CityActions from "../../../../src/app/store/city/city.actions"
import { cityReducer } from "../../../../src/app/store/city/city.reducer"
import { initialCityState } from "../../../../src/app/store/city/city.state"
import { citiesMock, getCityStateMock } from "../../../mocks/data/city.mock"
import { emptyAction } from "../../../mocks/common/actions.mock"

describe("City Reducer", () => {
  const mockCity = citiesMock[0]

  describe("initial state", () => {
    it("should return the initial state", () => {
      const state = cityReducer(undefined, emptyAction)

      expect(state).toEqual(initialCityState)
      expect(state.city).toBeNull()
    })
  })

  describe("setCity action", () => {
    it("should set the city", () => {
      const action = CityActions.setCity({ city: mockCity })
      const state = cityReducer(initialCityState, action)

      expect(state.city).toEqual(mockCity)
    })

    it("should replace existing city", () => {
      const existingState = getCityStateMock(1)
      const action = CityActions.setCity({ city: mockCity })
      const state = cityReducer(existingState, action)

      expect(state.city).toEqual(mockCity)
    })
  })
})
