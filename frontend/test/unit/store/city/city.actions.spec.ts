import * as CityActions from "../../../../src/app/store/city/city.actions"
import { citiesMock } from "../../../mocks/data/city.mock"

describe("City Actions", () => {
  const mockCity = citiesMock[0]

  it("should create setCity action", () => {
    const action = CityActions.setCity({ city: mockCity })

    expect(action.type).toEqual("[City] Set City")
    expect(action.city).toEqual(mockCity)
  })
})
