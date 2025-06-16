import { UrlGeneratorService } from "../../../src/url-generator/services/url-generator.service"
import {
  CLIENT_URL,
  WEATHER_API_KEY,
  WEATHER_API_URL
} from "./config.service.mock"
import { WeatherQueryDto } from "../../../src/weather/dto/weather-query.dto"

export const confirmUrlMock = `${CLIENT_URL}/confirm/`
export const unsubscribeUrlMock = `${CLIENT_URL}/unsubscribe/`
export const searchUrlMock = `${WEATHER_API_URL}/v1/search.json`
export const weatherUrlMock = `${WEATHER_API_URL}/v1/forecast.json`

export const urlGeneratorServiceMockFactory = () =>
  ({
    confirmUrl: jest.fn((token: string) => ({
      url: `${confirmUrlMock}${token}`,
      params: {}
    })),
    unsubscribeUrl: jest.fn((token: string) => ({
      url: `${unsubscribeUrlMock}${token}`,
      params: {}
    })),
    searchUrl: jest.fn((search: string) => ({
      url: searchUrlMock,
      params: {
        q: search
      }
    })),
    weatherUrl: jest.fn((dto: WeatherQueryDto) => ({
      url: weatherUrlMock,
      params: {
        key: WEATHER_API_KEY,
        q: dto.city,
        days: dto.days,
        aqi: "no",
        alerts: "no"
      }
    }))
  }) as never as UrlGeneratorService
