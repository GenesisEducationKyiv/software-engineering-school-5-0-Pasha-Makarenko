import { SearchProviderHandler } from "../../../src/search/providers/search.provider.handler"
import { City } from "../../../src/search/interfaces/search.interface"
import { citiesMock } from "../data/search.mock"

export class MockSuccessSearchProvider extends SearchProviderHandler {
  constructor(private mockData: City[] = citiesMock) {
    super()
  }

  async handle(): Promise<City[]> {
    return this.mockData
  }
}

export class MockErrorSearchProviderProvider extends SearchProviderHandler {
  constructor(private error: Error) {
    super()
  }

  async handle(): Promise<City[]> {
    throw this.error
  }
}
