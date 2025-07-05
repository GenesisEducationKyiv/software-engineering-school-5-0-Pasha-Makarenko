import { ClientRoutesConsts } from "../../../src/infrastructure/url-generator/consts/client-routes.consts"
import { IUrlGeneratorService } from "../../../src/infrastructure/url-generator/interfaces/url-generator.interfaces"

export const confirmUrlMock = (token: string) =>
  process.env["CLIENT_URL"] + ClientRoutesConsts.confirm(token)
export const unsubscribeUrlMock = (token: string) =>
  process.env["CLIENT_URL"] + ClientRoutesConsts.unsubscribe(token)

export const urlGeneratorServiceMockFactory = () =>
  ({
    confirmUrl: jest.fn((token: string) => ({
      url: confirmUrlMock(token),
      params: {}
    })),
    unsubscribeUrl: jest.fn((token: string) => ({
      url: unsubscribeUrlMock(token),
      params: {}
    }))
  }) as never as IUrlGeneratorService
