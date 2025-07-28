import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Query
} from "@nestjs/common"
import { QueryBus } from "@nestjs/cqrs"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { WeatherQueryDto } from "../../../application/weather/dto/weather-query.dto"
import { GetWeatherQuery } from "../../../application/weather/queries/impl/get-weather.query"

@ApiTags("Weather")
@Controller("weather")
export class WeatherController {
  private readonly logger = new Logger(WeatherController.name)

  constructor(private queryBus: QueryBus) {}

  @ApiOperation({ summary: "Weather" })
  @ApiResponse({ status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  @Get()
  async weather(@Query() dto: WeatherQueryDto) {
    this.logger.log({
      operation: "getWeather",
      params: dto,
      message: "Fetching weather data"
    })
    const result = await this.queryBus.execute(new GetWeatherQuery(dto))
    this.logger.log({
      operation: "getWeather",
      params: dto,
      message: "Weather data fetched successfully"
    })
    return result
  }
}
