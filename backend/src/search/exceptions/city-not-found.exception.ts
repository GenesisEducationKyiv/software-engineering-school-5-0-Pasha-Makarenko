import {
  BaseException,
  SerializedException
} from "../../shared/exceptions/base.exception"
import { HttpStatus } from "@nestjs/common"

export class CityNotFoundException extends BaseException {
  public readonly statusCode = HttpStatus.NOT_FOUND
  public readonly code = "CITY_NOT_FOUND"

  constructor(city: string) {
    super(`No cities found for "${city}"`)
  }

  serialize(): SerializedException {
    return {
      code: this.code,
      message: this.message
    }
  }
}
