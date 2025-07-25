import { NotificationDto } from "./notification.dto"
import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"
import { NotificationContext } from "../interfaces/context.interface"

export class ConfirmContextDto implements NotificationContext {
  @ApiProperty({
    example: "https://example.com/confirm/123",
    description: "Confirmation url"
  })
  @IsString()
  readonly confirmUrl: string
}

export class ConfirmationNotificationDto extends NotificationDto {
  readonly context: ConfirmContextDto
}
