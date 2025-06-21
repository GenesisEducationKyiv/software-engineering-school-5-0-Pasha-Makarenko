import { Logger } from "@nestjs/common"
import { IWeatherProvider } from "../interfaces/weather.provider.interface"
import { WeatherQueryDto } from "../dto/weather-query.dto"
import { WEATHER_PROVIDER } from "./weather.provider.factory"

export class WeatherLoggerDecorator implements IWeatherProvider {
  private readonly logger = new Logger(WEATHER_PROVIDER)

  constructor(private readonly provider: IWeatherProvider) {}

  async getWeather(dto: WeatherQueryDto) {
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
