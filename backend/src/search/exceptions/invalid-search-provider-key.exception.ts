import { BaseException } from "../../shared/exceptions/base.exception"
import { HttpStatus } from "@nestjs/common"

export class InvalidSearchProviderKeyException extends BaseException {
  public readonly statusCode = HttpStatus.INTERNAL_SERVER_ERROR
  public readonly code = "INVALID_SEARCH_PROVIDER_KEY"

  constructor(providerName: string) {
    super(`Invalid API key for search provider: ${providerName}`)
  }

  serialize() {
    return {
      code: this.code,
      message: this.message
    }
  }
}
