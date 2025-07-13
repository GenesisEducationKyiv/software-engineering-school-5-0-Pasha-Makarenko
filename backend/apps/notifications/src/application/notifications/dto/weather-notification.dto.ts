import { NotificationDto } from "./notification.dto"
import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"
import { WeatherData } from "../../../domain/notifications/value-objects/weather-data.value-object"

export class WeatherContextDto {
  @ApiProperty({
    example: "https://example.com/unsubscribe/123",
    description: "Unsubscription url"
  })
  @IsString()
  readonly unsubscribeUrl: string

  @ApiProperty({ example: {}, description: "Weather data" })
  readonly weather: WeatherData
}

export class WeatherNotificationDto extends NotificationDto {
  readonly context: WeatherContextDto
}
