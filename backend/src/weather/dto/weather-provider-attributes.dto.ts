import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

export class WeatherProviderAttributesDto {
  @ApiProperty({
    example: "https://example.com",
    description: "Weather provide url"
  })
  @IsString({ message: "Must be a string" })
  readonly url: string

  @ApiProperty({ example: "key", description: "Weather provider key" })
  @IsString({ message: "Must be a string" })
  @IsOptional({ message: "Key is optional" })
  readonly key?: string
}
