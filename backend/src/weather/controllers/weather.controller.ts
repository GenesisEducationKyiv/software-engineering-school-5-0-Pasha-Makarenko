import { Controller, Get, Query } from "@nestjs/common"
import { QueryBus } from "@nestjs/cqrs"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { WeatherQueryDto } from "../dto/weather-query.dto"
import { GetWeatherQuery } from "../queries/impl/get-weather.query"

@ApiTags("Weather")
@Controller("weather")
export class WeatherController {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({ summary: "Weather" })
  @ApiResponse({ status: 200 })
  @Get()
  async weather(@Query() dto: WeatherQueryDto) {
    return await this.queryBus.execute(new GetWeatherQuery(dto))
  }
}
