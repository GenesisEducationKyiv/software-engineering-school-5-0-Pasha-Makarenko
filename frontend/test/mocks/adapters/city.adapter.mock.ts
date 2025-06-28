import { of } from "rxjs"
import { City } from "../../../src/app/api/search/search.interface"
import { CityAdapter } from "../../../src/app/store/city/city.adapter"

export const cityAdapterMockFactory = () =>
  ({
    select: jest.fn(() => of(null as never as City)),
    setCity: jest.fn()
  }) as never as CityAdapter
