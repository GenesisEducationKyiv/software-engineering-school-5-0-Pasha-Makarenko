import { BaseException } from "../../../src/shared/exceptions/base.exception"
import { HttpStatus } from "@nestjs/common"

export class MockBaseException extends BaseException {
  public readonly statusCode = HttpStatus.BAD_REQUEST
  public readonly code = "MOCK_EXCEPTION"

  constructor(message: string) {
    super(message)
  }

  serialize() {
    return {
      code: this.code,
      message: this.message,
      details: { mock: true }
    }
  }
}

export class MockHttpException extends Error {
  constructor(
    public readonly status: number,
    public readonly message: string,
    public readonly response?: unknown
  ) {
    super(message)
    this.name = "HttpException"
  }

  getStatus() {
    return this.status
  }

  getResponse() {
    return this.response || this.message
  }
}
