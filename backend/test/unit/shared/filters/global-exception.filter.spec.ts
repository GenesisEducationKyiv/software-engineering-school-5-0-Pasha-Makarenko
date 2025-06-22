import { Test, TestingModule } from "@nestjs/testing"
import { ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common"
import { Request, Response } from "express"
import { GlobalExceptionFilter } from "../../../../src/shared/filters/global-exception.filter"
import {
  MockBaseException,
  MockHttpException
} from "../../../mocks/exceptions/base.exception.mock"

describe("GlobalExceptionFilter", () => {
  let filter: GlobalExceptionFilter
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockHost: Partial<ArgumentsHost>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GlobalExceptionFilter]
    }).compile()

    filter = module.get<GlobalExceptionFilter>(GlobalExceptionFilter)

    mockRequest = {
      method: "GET",
      url: "/test"
    }

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn().mockReturnValue(mockResponse)
      })
    }
  })

  it("should handle BaseException correctly", () => {
    const exception = new MockBaseException("Test error")

    filter.catch(exception, mockHost as ArgumentsHost)

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST)
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        code: "MOCK_EXCEPTION",
        message: "Test error",
        details: { mock: true },
        timestamp: expect.any(String),
        path: "/test",
        method: "GET"
      })
    )
  })

  it("should handle HttpException with string response", () => {
    const exception = new MockHttpException(HttpStatus.NOT_FOUND, "Not found")

    filter.catch(
      exception as unknown as HttpException,
      mockHost as ArgumentsHost
    )

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND)
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.NOT_FOUND,
        code: "HTTP_EXCEPTION",
        message: "Not found"
      })
    )
  })

  it("should handle HttpException with object response", () => {
    const exception = new MockHttpException(
      HttpStatus.BAD_REQUEST,
      "Bad Request",
      {
        message: "Validation failed",
        error: "VALIDATION_ERROR",
        details: { field: "email" }
      }
    )

    filter.catch(
      exception as unknown as HttpException,
      mockHost as ArgumentsHost
    )

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST)
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: { field: "email" }
      })
    )
  })

  it("should handle HttpException with array message", () => {
    const exception = new MockHttpException(
      HttpStatus.BAD_REQUEST,
      "Bad Request",
      { message: ["Error 1", "Error 2"], error: "VALIDATION_ERROR" }
    )

    filter.catch(
      exception as unknown as HttpException,
      mockHost as ArgumentsHost
    )

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Error 1"
      })
    )
  })

  it("should handle generic Error", () => {
    const exception = new Error("Generic error")

    filter.catch(exception, mockHost as ArgumentsHost)

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR
    )
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error"
      })
    )
  })

  it("should handle unknown exception types", () => {
    const exception = "String error"

    filter.catch(exception, mockHost as ArgumentsHost)

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR
    )
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error"
      })
    )
  })

  it("should include timestamp in response", () => {
    const exception = new MockBaseException("Test error")
    const beforeCall = new Date()

    filter.catch(exception, mockHost as ArgumentsHost)

    const afterCall = new Date()
    const responseCall = (mockResponse.json as jest.Mock).mock.calls[0][0]
    const timestamp = new Date(responseCall.timestamp)

    expect(timestamp.getTime()).toBeGreaterThanOrEqual(beforeCall.getTime())
    expect(timestamp.getTime()).toBeLessThanOrEqual(afterCall.getTime())
  })

  it("should handle HttpException with missing response properties", () => {
    const exception = new MockHttpException(
      HttpStatus.BAD_REQUEST,
      "Bad Request",
      { message: undefined, error: undefined }
    )

    filter.catch(
      exception as unknown as HttpException,
      mockHost as ArgumentsHost
    )

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: "HTTP_EXCEPTION",
        message: "Bad Request"
      })
    )
  })
})
