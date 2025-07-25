import { IsEnum, IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { NotificationType } from "../enums/notification-type.enum"

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
    enum: NotificationType
  })
  @IsEnum(NotificationType)
  readonly type: NotificationType

  abstract readonly context: unknown
}
