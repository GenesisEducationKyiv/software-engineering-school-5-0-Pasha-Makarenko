import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { GetConfirmUrlQuery } from "../get-confirm-url.query"
import { ClientRoutesConsts } from "../../consts/client-routes.consts"

@QueryHandler(GetConfirmUrlQuery)
export class GetConfirmUrlHandler implements IQueryHandler<GetConfirmUrlQuery> {
  async execute(query: GetConfirmUrlQuery) {
    const { token, clientUrl } = query
    return clientUrl + ClientRoutesConsts.confirm(token)
  }
}
