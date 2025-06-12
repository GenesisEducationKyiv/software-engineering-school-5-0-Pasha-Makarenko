import { IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class WeatherApiUrlQueryDto {
  @ApiProperty({
    example: "https://some-weather-api.com",
    description: "Base URL for the weather API"
  })
  @IsString()
  readonly weatherApiUrl: string

  @ApiProperty({
    example: "your_api_key",
    description: "API key for the weather API"
  })
  @IsString()
  readonly weatherApiKey: string
}
