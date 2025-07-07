import { SearchProviderHandler } from "../../../src/infrastructure/search/services/providers/search.provider.handler"
import { City } from "../../../src/domain/search/entities/city.entity"
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
