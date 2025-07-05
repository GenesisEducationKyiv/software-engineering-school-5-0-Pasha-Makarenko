import { Logger } from "@nestjs/common"
import {
  IWeatherProvider,
  WEATHER_PROVIDER
} from "../../../../domain/weather/providers/weather.provider.interface"
import { WeatherGetting } from "../../../../domain/weather/value-objects/weather-getting.value-object"

export class WeatherLoggerDecorator implements IWeatherProvider {
  private readonly logger = new Logger(WEATHER_PROVIDER)

  constructor(private readonly provider: IWeatherProvider) {}

  async getWeather(dto: WeatherGetting) {
    this.logger.log(`Getting weather for city (${dto.days} days): ${dto.city}`)
    try {
      const result = await this.provider.getWeather(dto)
      this.logger.log(`Weather data received for city: ${dto.city}`)
      return result
    } catch (error) {
      this.logger.error(
        `Error getting weather for city: ${dto.city}`,
        error.stack
      )
      throw error
    }
  }
}
