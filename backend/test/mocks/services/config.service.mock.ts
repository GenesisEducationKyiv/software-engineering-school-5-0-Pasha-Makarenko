import { ConfigService } from "@nestjs/config"

export const CLIENT_URL = "https://example.com"
export const WEATHER_API_URL = "https://api.weatherapi.com"
export const WEATHER_API_KEY = "test"
export const SMTP_USER = "noreply@example.com"
export const SEARCH_CACHE_TTL = 5000
export const WEATHER_CACHE_TTL = 60000

export const configServiceMockFactory = () =>
  ({
    get: jest.fn((key: string) => {
      switch (key) {
        case "SMTP_USER":
          return SMTP_USER
        case "CLIENT_URL":
          return CLIENT_URL
        case "WEATHER_API_URL":
          return WEATHER_API_URL
        case "WEATHER_API_KEY":
          return WEATHER_API_KEY
        case "SEARCH_CACHE_TTL":
          return SEARCH_CACHE_TTL
        case "WEATHER_CACHE_TTL":
          return WEATHER_CACHE_TTL
        default:
          return undefined
      }
    })
  }) as never as ConfigService
