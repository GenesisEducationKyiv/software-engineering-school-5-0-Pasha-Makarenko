import { CookieService } from "ngx-cookie-service"

export const cookieServiceMockFactory = () =>
  ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn()
  }) as never as CookieService
