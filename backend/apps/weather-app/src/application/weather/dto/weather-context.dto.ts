import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"
import { WeatherContext } from "../../../domain/notifications/value-objects/weather-context.value-object"

export class WeatherContextDto {
  @ApiProperty({ example: "123", description: "Unsubscription url" })
  @IsString()
  readonly unsubscribeUrl: string

  @ApiProperty({ example: {}, description: "Weather data" })
  readonly weather: WeatherContext
}
