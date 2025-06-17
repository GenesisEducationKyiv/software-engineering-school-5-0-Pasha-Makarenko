import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { GeneratedUrl } from "../interfaces/url-generator.interfaces"
import { ClientRoutesConsts } from "../consts/client-routes.consts"

@Injectable()
export class ClientUrlGeneratorService {
  private readonly clientUrl: string

  constructor(private configService: ConfigService) {
    this.clientUrl = this.configService.get<string>("CLIENT_URL")!
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
}
