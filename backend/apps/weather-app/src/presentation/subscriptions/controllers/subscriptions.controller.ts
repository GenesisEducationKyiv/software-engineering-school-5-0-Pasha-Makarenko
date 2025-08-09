import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post
} from "@nestjs/common"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { CreateSubscriptionDto } from "../../../application/subscriptions/dto/create-subscription.dto"
import { CommandBus } from "@nestjs/cqrs"
import { CreateSubscriptionCommand } from "../../../application/subscriptions/commands/impl/create-subscription.command"
import { ConfirmSubscriptionCommand } from "../../../application/subscriptions/commands/impl/confirm-subscription.command"
import { UnsubscribeCommand } from "../../../application/subscriptions/commands/impl/unsubscribe.command"

@ApiTags("Subscriptions")
@Controller("")
export class SubscriptionsController {
  private readonly logger = new Logger(SubscriptionsController.name)

  constructor(private commandBus: CommandBus) {}

  @ApiOperation({ summary: "Subscribe" })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post("subscribe")
  async subscribe(@Body() dto: CreateSubscriptionDto) {
    this.logger.log({
      operation: "subscribe",
      params: dto,
      message: "Creating subscription"
    })
    await this.commandBus.execute(new CreateSubscriptionCommand(dto))
    this.logger.log({
      operation: "subscribe",
      params: dto,
      message: "Subscription created successfully"
    })
  }

  @ApiOperation({ summary: "Confirm subscription" })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post("confirm/:token")
  async confirm(@Param("token") token: string) {
    this.logger.log({
      operation: "confirmSubscription",
      params: { token },
      message: "Confirming subscription"
    })
    await this.commandBus.execute(new ConfirmSubscriptionCommand(token))
    this.logger.log({
      operation: "confirmSubscription",
      params: { token },
      message: "Subscription confirmed successfully"
    })
  }

  @ApiOperation({ summary: "Unsubscribe" })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post("unsubscribe/:token")
  async unsubscribe(@Param("token") token: string) {
    this.logger.log({
      operation: "unsubscribe",
      params: { token },
      message: "Unsubscribing"
    })
    await this.commandBus.execute(new UnsubscribeCommand(token))
    this.logger.log({
      operation: "unsubscribe",
      params: { token },
      message: "Unsubscribed successfully"
    })
  }
}
