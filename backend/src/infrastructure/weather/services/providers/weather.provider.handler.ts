import { IWeatherProvider } from "../../../../domain/weather/providers/weather.provider.interface"
import { WeatherProviderException } from "../../exceptions/weather-provider.exception"
import { IHandler } from "../../../common/interfaces/handler.interface"
import { WeatherData } from "../../../../domain/weather/value-objects/weather-data.value-object"
import { WeatherGetting } from "../../../../domain/weather/value-objects/weather-getting.value-object"

export abstract class WeatherProviderHandler
  implements IWeatherProvider, IHandler
{
  protected next?: WeatherProviderHandler

  setNext(handler: WeatherProviderHandler): WeatherProviderHandler {
    this.next = handler
    return handler
  }

  async getWeather(dto: WeatherGetting): Promise<WeatherData> {
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

  protected abstract handle(dto: WeatherGetting): Promise<WeatherData>
}
