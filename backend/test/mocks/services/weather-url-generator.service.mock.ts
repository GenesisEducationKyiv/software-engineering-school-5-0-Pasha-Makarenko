import { WeatherUrlGeneratorService } from "../../../src/url-generator/services/weather-url-generator.service"
import { WeatherQueryDto } from "../../../src/weather/dto/weather-query.dto"
import { WeatherApiConst } from "../../../src/url-generator/consts/weather-api.const"

export const searchUrlMock =
  process.env["WEATHER_API_URL"] + WeatherApiConst.search
export const weatherUrlMock =
  process.env["WEATHER_API_URL"] + WeatherApiConst.weather

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
        key: process.env["WEATHER_API_KEY"],
        q: dto.city,
        days: dto.days,
        aqi: "no",
        alerts: "no"
      }
    }))
  }) as never as WeatherUrlGeneratorService
