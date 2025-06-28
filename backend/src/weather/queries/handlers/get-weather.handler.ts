import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { GetWeatherQuery } from "../impl/get-weather.query"
import { Inject } from "@nestjs/common"
import { IWeatherProvider } from "../../interfaces/weather.provider.interface"
import { WEATHER_PROVIDER } from "../../providers/weather.provider.factory"

@QueryHandler(GetWeatherQuery)
export class GetWeatherHandler implements IQueryHandler<GetWeatherQuery> {
  constructor(
    @Inject(WEATHER_PROVIDER)
    private weatherProvider: IWeatherProvider
  ) {}

  async execute(query: GetWeatherQuery) {
    const { dto } = query

    return await this.weatherProvider.getWeather(dto)
  }
}
