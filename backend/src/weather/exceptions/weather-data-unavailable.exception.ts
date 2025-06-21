import {
  BaseException,
  SerializedException
} from "../../shared/exceptions/base.exception"
import { HttpStatus } from "@nestjs/common"

export class WeatherDataUnavailableException extends BaseException {
  public readonly statusCode = HttpStatus.SERVICE_UNAVAILABLE
  public readonly code = "WEATHER_DATA_UNAVAILABLE"

  constructor(message = "Weather data is currently unavailable") {
    super(message)
  }

  serialize(): SerializedException {
    return {
      code: this.code,
      message: this.message
    }
  }
}
