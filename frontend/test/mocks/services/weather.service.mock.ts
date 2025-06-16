import { WeatherService } from "../../../src/app/api/weather/weather.service"

export const weatherServiceMockFactory = () =>
  ({
    getWeather: jest.fn()
  }) as never as WeatherService
