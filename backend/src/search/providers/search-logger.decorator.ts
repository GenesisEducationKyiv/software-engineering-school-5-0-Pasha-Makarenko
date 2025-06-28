import { ISearchProvider } from "../interfaces/search.provider.interface"
import { Logger } from "@nestjs/common"
import { SEARCH_PROVIDER } from "./search.provider.factory"

export class SearchLoggerDecorator implements ISearchProvider {
  private readonly logger = new Logger(SEARCH_PROVIDER)

  constructor(private readonly provider: ISearchProvider) {}

  async search(city: string) {
    this.logger.log(`Searching for city: ${city}`)
    try {
      const result = await this.provider.search(city)
      this.logger.log(`Search completed for city: ${city}`)
      return result
    } catch (error) {
      this.logger.error(`Search failed for city: ${city}`, error.stack)
      throw error
    }
  }
}
