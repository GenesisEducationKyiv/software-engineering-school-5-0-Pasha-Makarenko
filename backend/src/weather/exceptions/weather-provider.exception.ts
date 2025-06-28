import {
  BaseException,
  SerializedException
} from "../../shared/exceptions/base.exception"
import { HttpStatus } from "@nestjs/common"

export class WeatherProviderException extends BaseException {
  public readonly statusCode = HttpStatus.INTERNAL_SERVER_ERROR
  public readonly code = "WEATHER_PROVIDER_ERROR"

  constructor(
    message: string,
    public readonly details?: unknown
  ) {
    super(message)
  }

  serialize(): SerializedException {
    return {
      code: this.code,
      message: this.message,
      details: this.details
    }
  }
}
