import { IsEnum, IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { NotificationStrategyType } from "../interfaces/send-notification.strategy"
import { NotificationContext } from "../interfaces/context.interface"

export abstract class NotificationDto {
  @ApiProperty({
    example: ["example@gmail.com"],
    description: "User email list"
  })
  readonly recipients: string[]

  @ApiProperty({ example: "Confirm subscription", description: "Mail subject" })
  @IsString()
  readonly subject: string

  @ApiProperty({
    example: "email",
    description: "Notification type",
    enum: NotificationStrategyType
  })
  @IsEnum(NotificationStrategyType)
  readonly type: NotificationStrategyType

  abstract readonly context: NotificationContext
}
