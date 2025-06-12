import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { WeatherApiUrlQueryDto } from "./dto/weather-api-url-query.dto"
import { QueryBus } from "@nestjs/cqrs"
import { GetConfirmUrlQuery } from "./queries/get-confirm-url.query"
import { GetUnsubscribeUrlQuery } from "./queries/get-unsubscribe-url.query"
import { WeatherQueryDto } from "../weather/dto/weather-query.dto"
import { GetWeatherUrlQuery } from "./queries/get-weather-url.query"
import { GetSearchUrlQuery } from "./queries/get-search-url.query"
import { ComplexUrlResponseDto } from "./dto/complex-url-response.dto"

@Injectable()
export class UrlGeneratorService {
  private readonly clientUrl: string
  private readonly weatherApiUrlQueryDto: WeatherApiUrlQueryDto

  constructor(
    private configService: ConfigService,
    private queryBus: QueryBus
  ) {
    this.clientUrl = this.configService.get<string>("CLIENT_URL")!
    this.weatherApiUrlQueryDto = {
      weatherApiUrl: this.configService.get<string>("WEATHER_API_URL")!,
      weatherApiKey: this.configService.get<string>("WEATHER_API_KEY")!
    }
  }

  async confirmUrl(token: string): Promise<string> {
    return await this.queryBus.execute(
      new GetConfirmUrlQuery(this.clientUrl, token)
    )
  }

  async unsubscribeUrl(token: string): Promise<string> {
    return await this.queryBus.execute(
      new GetUnsubscribeUrlQuery(this.clientUrl, token)
    )
  }

  async weatherUrl(dto: WeatherQueryDto): Promise<ComplexUrlResponseDto> {
    return await this.queryBus.execute(
      new GetWeatherUrlQuery(this.weatherApiUrlQueryDto, dto)
    )
  }

  async searchUrl(search: string): Promise<ComplexUrlResponseDto> {
    return await this.queryBus.execute(
      new GetSearchUrlQuery(this.weatherApiUrlQueryDto, search)
    )
  }
}
