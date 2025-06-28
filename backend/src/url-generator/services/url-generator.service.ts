import { Injectable } from "@nestjs/common"
import { GeneratedUrl } from "../interfaces/url-generator.interfaces"
import { ClientRoutesConsts } from "../consts/client-routes.consts"

@Injectable()
export class UrlGeneratorService {
  constructor(private readonly clientUrl: string) {}

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
