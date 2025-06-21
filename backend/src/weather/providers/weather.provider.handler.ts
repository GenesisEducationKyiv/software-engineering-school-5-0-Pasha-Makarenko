import { IWeatherProvider } from "../interfaces/weather.provider.interface"
import { WeatherQueryDto } from "../dto/weather-query.dto"
import { WeatherData } from "../interfaces/weather.interface"
import { WeatherProviderException } from "../exceptions/weather-provider.exception"

export abstract class WeatherProviderHandler implements IWeatherProvider {
  protected next?: WeatherProviderHandler

  setNext(handler: WeatherProviderHandler): WeatherProviderHandler {
    this.next = handler
    return handler
  }

  async getWeather(dto: WeatherQueryDto): Promise<WeatherData> {
    try {
      const data = await this.handle(dto)

      if (data) {
        return data
      }

      if (this.next) {
        return this.next.getWeather(dto)
      }

      throw new WeatherProviderException(
        "All weather providers failed to return data"
      )
    } catch (error) {
      if (this.next) {
        return this.next.getWeather(dto)
      }

      throw error
    }
  }

  protected abstract handle(dto: WeatherQueryDto): Promise<WeatherData>
}
