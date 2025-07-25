import { Injectable } from "@nestjs/common"
import { IUrlGeneratorService } from "../../../application/common/interfaces/url-generator.interfaces"
import { ClientRoutesConsts } from "../consts/client-routes.consts"

@Injectable()
export class UrlGeneratorService implements IUrlGeneratorService {
  constructor(private readonly clientUrl: string) {}

  confirmUrl(token: string) {
    return this.clientUrl + ClientRoutesConsts.confirm(token)
  }

  unsubscribeUrl(token: string) {
    return this.clientUrl + ClientRoutesConsts.unsubscribe(token)
  }
}
