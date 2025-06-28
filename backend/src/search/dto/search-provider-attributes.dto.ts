import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

export class SearchProviderAttributesDto {
  @ApiProperty({
    example: "https://example.com",
    description: "Search provide url"
  })
  @IsString({ message: "Must be a string" })
  readonly url: string

  @ApiProperty({ example: "key", description: "Search provider key" })
  @IsString({ message: "Must be a string" })
  @IsOptional({ message: "Key is optional" })
  readonly key?: string
}
