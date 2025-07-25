import { QueryHandler } from "../services/cqrs.mock"
import { GetWeatherQuery } from "../../../src/application/weather/queries/impl/get-weather.query"
import { WeatherData } from "../../../src/domain/weather/value-objects/weather-data.value-object"
import { weatherDataMock } from "../data/weather.mock"

export class GetWeatherQueryHandler
  implements QueryHandler<GetWeatherQuery, WeatherData>
{
  async handle(_query: GetWeatherQuery) {
    return weatherDataMock
  }
}
