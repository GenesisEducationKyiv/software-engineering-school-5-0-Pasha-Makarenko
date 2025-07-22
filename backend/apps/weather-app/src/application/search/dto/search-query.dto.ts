import { IsNotEmpty, IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class SearchQueryDto {
  @ApiProperty({ example: "London", description: "Weather in current city" })
  @IsString({ message: "Must be a string" })
  @IsNotEmpty({ message: "City name cannot be empty" })
  readonly city: string
}
