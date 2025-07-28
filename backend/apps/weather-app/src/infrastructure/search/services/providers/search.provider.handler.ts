import {
  ISearchProvider,
  SEARCH_PROVIDER
} from "../../../../domain/search/providers/search.provider.interface"
import { IHandler } from "../../../common/interfaces/handler.interface"
import { City } from "../../../../domain/search/entities/city.entity"
import { ProviderException } from "../../../common/exceptions/provider.exception"
import { Logger } from "@nestjs/common"

export abstract class SearchProviderHandler
  implements ISearchProvider, IHandler
{
  private readonly logger = new Logger(SEARCH_PROVIDER)
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

      throw new ProviderException("All weather providers failed to return data")
    } catch (error) {
      this.logger.error({
        operation: "search",
        params: { city },
        message: `Error searching for cities via provider ${this.constructor.name}`,
        error: error
      })

      if (this.next) {
        return this.next.search(city)
      }

      throw error
    }
  }

  protected abstract handle(city: string): Promise<City[]>
}
