import { Injectable } from "@nestjs/common"
import {
  GeneratedUrl,
  IUrlGeneratorService
} from "../interfaces/url-generator.interfaces"
import { ClientRoutesConsts } from "../consts/client-routes.consts"

export const URL_GENERATOR_SERVICE = "URL_GENERATOR_SERVICE"

@Injectable()
export class UrlGeneratorService implements IUrlGeneratorService {
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
