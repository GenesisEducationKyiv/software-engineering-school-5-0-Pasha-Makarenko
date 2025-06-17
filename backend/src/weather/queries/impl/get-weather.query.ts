import { WeatherQueryDto } from "../../dto/weather-query.dto"
import { Query } from "@nestjs/cqrs"
import { WeatherData } from "../../interfaces/weather.interface"

export class GetWeatherQuery extends Query<WeatherData> {
  constructor(public readonly dto: WeatherQueryDto) {
    super()
  }
}
