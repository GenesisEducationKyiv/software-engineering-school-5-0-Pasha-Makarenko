import { NotificationDto } from "./notification.dto"
import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class ConfirmContextDto {
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
