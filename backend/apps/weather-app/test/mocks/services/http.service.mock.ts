import { HttpService } from "@nestjs/axios"

export const httpServiceMockFactory = () =>
  ({
    get: jest.fn()
  }) as never as HttpService
