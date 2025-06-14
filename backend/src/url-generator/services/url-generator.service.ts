import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { GeneratedUrl } from "../interfaces/url-generator.interfaces"
import { ClientRoutesConsts } from "../consts/client-routes.consts"
import { WeatherQueryDto } from "../../weather/dto/weather-query.dto"
import { WeatherApiConst } from "../consts/weather-api.const"

@Injectable()
export class UrlGeneratorService {
  private readonly clientUrl: string
  private readonly weatherApiUrl: string
  private readonly weatherApiKey: string

  constructor(private configService: ConfigService) {
    this.clientUrl = this.configService.get<string>("CLIENT_URL")!
    this.weatherApiUrl = this.configService.get<string>("WEATHER_API_URL")!
    this.weatherApiKey = this.configService.get<string>("WEATHER_API_KEY")!
  }

  confirmUrl(token: string): GeneratedUrl {
    return {
      url: this.clientUrl + ClientRoutesConsts.confirm(token),
      params: {}
    }
  }

  unsubscribeUrl(token: string): GeneratedUrl {
    return {
      url: this.clientUrl + ClientRoutesConsts.unsubscribe(token),
      params: {}
    }
  }

  weatherUrl(dto: WeatherQueryDto): GeneratedUrl {
    return {
      url: this.weatherApiUrl + WeatherApiConst.weather,
      params: {
        key: this.weatherApiKey,
        q: dto.city,
        days: dto.days,
        aqi: "no",
        alerts: "no"
      }
    }
  }

  searchUrl(search: string): GeneratedUrl {
    return {
      url: this.weatherApiUrl + WeatherApiConst.search,
      params: {
        key: this.weatherApiKey,
        q: search
      }
    }
  }
}
