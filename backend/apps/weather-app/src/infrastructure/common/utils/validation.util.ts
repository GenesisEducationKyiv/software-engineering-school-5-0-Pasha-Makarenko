import * as Joi from "joi"
import { InvalidDataException } from "../../../domain/common/exceptions/invalid-data.exception"

export class ValidationUtil {
  static validate<T>(
    schema: Joi.ObjectSchema | Joi.ArraySchema,
    data: unknown
  ): T {
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true
    })

    if (error) {
      throw new InvalidDataException(
        `Validation failed: ${error.details.map(detail => detail.message).join(", ")}`
      )
    }

    return value as T
  }

  static validateWithCustomError<T>(
    schema: Joi.ObjectSchema | Joi.ArraySchema,
    data: unknown,
    errorMessage: string
  ): T {
    try {
      return this.validate<T>(schema, data)
    } catch (error) {
      throw new InvalidDataException(`${errorMessage}: ${error.message}`)
    }
  }
}
