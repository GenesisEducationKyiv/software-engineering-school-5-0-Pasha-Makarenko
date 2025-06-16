import {
  selectCity,
  selectCityState
} from "../../../../src/app/store/city/city.selectors"
import { appStateMock } from "../../../mocks/common/state.mock"
import { getCityStateMock } from "../../../mocks/data/city.mock"

describe("City Selectors", () => {
  const initialState = appStateMock

  it("should select the city state", () => {
    const result = selectCityState(initialState)
    expect(result).toEqual(initialState.city)
  })

  it("should select the city", () => {
    const result = selectCity.projector(initialState.city)
    expect(result).toEqual(initialState.city.city)
  })

  it("should return null when no city is selected", () => {
    const result = selectCity.projector(getCityStateMock(-1))
    expect(result).toBeNull()
  })
})
