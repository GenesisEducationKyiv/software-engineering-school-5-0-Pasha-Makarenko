import { ITokenService } from "../../../src/application/common/interfaces/token-service.interface"

export const tokenServiceMockFactory = () =>
  ({
    generate: jest.fn(() => "mocked-token")
  }) as never as ITokenService
