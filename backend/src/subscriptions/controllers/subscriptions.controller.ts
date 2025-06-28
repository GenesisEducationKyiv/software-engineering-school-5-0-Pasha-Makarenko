import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post
} from "@nestjs/common"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { CreateSubscriptionDto } from "../dto/create-subscription.dto"
import { CommandBus } from "@nestjs/cqrs"
import { CreateSubscriptionCommand } from "../commands/impl/create-subscription.command"
import { ConfirmSubscriptionCommand } from "../commands/impl/confirm-subscription.command"
import { UnsubscribeCommand } from "../commands/impl/unsubscribe.command"

@ApiTags("Subscriptions")
@Controller("")
export class SubscriptionsController {
  constructor(private commandBus: CommandBus) {}

  @ApiOperation({ summary: "Subscribe" })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post("subscribe")
  async subscribe(@Body() dto: CreateSubscriptionDto) {
    return await this.commandBus.execute(new CreateSubscriptionCommand(dto))
  }

  @ApiOperation({ summary: "Confirm subscription" })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post("confirm/:token")
  async confirm(@Param("token") token: string) {
    return await this.commandBus.execute(new ConfirmSubscriptionCommand(token))
  }

  @ApiOperation({ summary: "Unsubscribe" })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post("unsubscribe/:token")
  async unsubscribe(@Param("token") token: string) {
    return await this.commandBus.execute(new UnsubscribeCommand(token))
  }
}
