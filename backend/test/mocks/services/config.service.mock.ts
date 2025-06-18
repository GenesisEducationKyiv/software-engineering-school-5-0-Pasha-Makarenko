import { ConfigService } from "@nestjs/config"

export const configServiceMockFactory = () =>
  ({
    get: jest.fn((key: string) => {
      return process.env[key]
    })
  }) as never as ConfigService
