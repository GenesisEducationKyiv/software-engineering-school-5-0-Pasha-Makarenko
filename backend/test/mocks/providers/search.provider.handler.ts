import { SearchProviderHandler } from "../../../src/search/providers/search.provider.handler"
import { City } from "../../../src/search/interfaces/search.interface"
import { SearchProviderException } from "../../../src/search/exceptions/search-provider.exception"

export class MockSearchProvider extends SearchProviderHandler {
  constructor(
    private shouldReturnData: boolean,
    private shouldThrow = false
  ) {
    super()
  }

  protected async handle(city: string): Promise<City[]> {
    if (this.shouldThrow) {
      throw new SearchProviderException("Provider error")
    }

    if (this.shouldReturnData) {
      return [
        {
          id: 1,
          name: "Test City",
          country: "Test Country",
          lat: 0,
          lon: 0,
          url: "test-city"
        }
      ]
    }

    return []
  }
}
