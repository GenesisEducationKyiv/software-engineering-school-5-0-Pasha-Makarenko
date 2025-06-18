import { WeatherUrlGeneratorService } from "../../../src/url-generator/services/weather-url-generator.service"
import { WEATHER_API_KEY, WEATHER_API_URL } from "./config.service.mock"
import { WeatherQueryDto } from "../../../src/weather/dto/weather-query.dto"
import { WeatherApiConst } from "../../../src/url-generator/consts/weather-api.const"

export const searchUrlMock = WEATHER_API_URL + WeatherApiConst.search
export const weatherUrlMock = WEATHER_API_URL + WeatherApiConst.weather

export const weatherUrlGeneratorServiceMockFactory = () =>
  ({
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
  }) as never as WeatherUrlGeneratorService
