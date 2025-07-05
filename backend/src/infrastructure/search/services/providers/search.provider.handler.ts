import { ISearchProvider } from "../../../../domain/search/providers/search.provider.interface"
import { IHandler } from "../../../common/interfaces/handler.interface"
import { City } from "../../../../domain/search/value-objects/city.value-object"
import { SearchProviderException } from "../../exceptions/search-provider.exception"

export abstract class SearchProviderHandler
  implements ISearchProvider, IHandler
{
  protected next?: SearchProviderHandler

  setNext(handler: SearchProviderHandler): SearchProviderHandler {
    this.next = handler
    return handler
  }

  async search(city: string): Promise<City[]> {
    try {
      const data = await this.handle(city)

      if (data) {
        return data
      }

      if (this.next) {
        return this.next.search(city)
      }

      throw new SearchProviderException(
        "All weather providers failed to return data"
      )
    } catch (error) {
      if (this.next) {
        return this.next.search(city)
      }

      throw error
    }
  }

  protected abstract handle(city: string): Promise<City[]>
}
