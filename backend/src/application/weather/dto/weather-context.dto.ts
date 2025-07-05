import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"
import { WeatherData } from "../../../domain/weather/value-objects/weather-data.value-object"

export class WeatherContextDto {
  @ApiProperty({ example: "123", description: "Unsubscription url" })
  @IsString()
  readonly unsubscribeUrl: string

  @ApiProperty({ example: {}, description: "Weather data" })
  readonly weather: WeatherData
}
