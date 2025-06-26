import { BaseException } from "../../shared/exceptions/base.exception"
import { HttpStatus } from "@nestjs/common"

export class InvalidWeatherProviderKeyException extends BaseException {
  public readonly statusCode = HttpStatus.INTERNAL_SERVER_ERROR
  public readonly code = "INVALID_WEATHER_PROVIDER_KEY"

  constructor(providerName: string) {
    super(`Invalid API key for weather provider: ${providerName}`)
  }

  serialize() {
    return {
      code: this.code,
      message: this.message
    }
  }
}
