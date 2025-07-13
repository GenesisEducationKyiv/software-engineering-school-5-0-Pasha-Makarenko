import { WeatherQueryDto } from "../../dto/weather-query.dto"
import { Query } from "@nestjs/cqrs"
import { WeatherData } from "../../../../domain/weather/value-objects/weather-data.value-object"

export class GetWeatherQuery extends Query<WeatherData> {
  constructor(public readonly dto: WeatherQueryDto) {
    super()
  }
}
