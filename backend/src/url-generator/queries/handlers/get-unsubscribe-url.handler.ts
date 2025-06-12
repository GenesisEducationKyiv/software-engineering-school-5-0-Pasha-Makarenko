import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { GetUnsubscribeUrlQuery } from "../get-unsubscribe-url.query"
import { ClientRoutesConsts } from "../../consts/client-routes.consts"

@QueryHandler(GetUnsubscribeUrlQuery)
export class GetUnsubscribeUrlHandler
  implements IQueryHandler<GetUnsubscribeUrlQuery>
{
  async execute(query: GetUnsubscribeUrlQuery) {
    const { token, clientUrl } = query
    return clientUrl + ClientRoutesConsts.unsubscribe(token)
  }
}
