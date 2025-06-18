import { ClientUrlGeneratorService } from "../../../src/url-generator/services/client-url-generator.service"
import { CLIENT_URL } from "./config.service.mock"
import { ClientRoutesConsts } from "../../../src/url-generator/consts/client-routes.consts"

export const confirmUrlMock = (token: string) =>
  CLIENT_URL + ClientRoutesConsts.confirm(token)
export const unsubscribeUrlMock = (token: string) =>
  CLIENT_URL + ClientRoutesConsts.unsubscribe(token)

export const clientUrlGeneratorServiceMockFactory = () =>
  ({
    confirmUrl: jest.fn((token: string) => ({
      url: confirmUrlMock(token),
      params: {}
    })),
    unsubscribeUrl: jest.fn((token: string) => ({
      url: unsubscribeUrlMock(token),
      params: {}
    }))
  }) as never as ClientUrlGeneratorService
