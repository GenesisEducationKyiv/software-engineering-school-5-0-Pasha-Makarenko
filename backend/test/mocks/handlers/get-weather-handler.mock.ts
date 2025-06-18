import { GetWeatherQuery } from "../../../src/weather/queries/impl/get-weather.query"
import { WeatherData } from "../../../src/weather/interfaces/weather.interface"
import { weatherDataMock } from "../data/weather.mock"
import { QueryHandler } from "../services/cqrs.mock"

export class GetWeatherQueryHandler
  implements QueryHandler<GetWeatherQuery, WeatherData>
{
  async handle(_query: GetWeatherQuery) {
    return weatherDataMock
  }
}
