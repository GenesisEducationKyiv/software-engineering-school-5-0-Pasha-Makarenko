export interface SerializedException {
  code: string
  message: string
  details?: unknown
}

export abstract class BaseException extends Error {
  public readonly statusCode: number
  public readonly code: string

  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, BaseException.prototype)
  }

  abstract serialize(): SerializedException
}
