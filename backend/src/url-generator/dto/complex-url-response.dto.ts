import { IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class ComplexUrlResponseDto {
  @ApiProperty({
    example: "https://example.com/api/resource",
    description: "The complete URL for the API resource"
  })
  @IsString()
  readonly url: string

  @ApiProperty({
    example: { key: "12345", q: "London", days: 3, aqi: "no", alerts: "no" },
    description: "Parameters to be included in the URL query string"
  })
  @IsString({ each: true })
  readonly params: Record<string, string | number | boolean>
}
