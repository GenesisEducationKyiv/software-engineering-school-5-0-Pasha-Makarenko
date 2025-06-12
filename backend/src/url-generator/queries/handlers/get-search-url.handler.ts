import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { GetSearchUrlQuery } from "../get-search-url.query"
import { WeatherApiConst } from "../../consts/weather-api.const"

@QueryHandler(GetSearchUrlQuery)
export class GetSearchUrlHandler implements IQueryHandler<GetSearchUrlQuery> {
  async execute(query: GetSearchUrlQuery) {
    const { urlDto, search } = query

    return {
      url: urlDto.weatherApiUrl + WeatherApiConst.search,
      params: {
        key: urlDto.weatherApiKey,
        q: search
      }
    }
  }
}
