import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString } from "class-validator"

export class FindSubscriptionDto {
  @ApiProperty({ example: "example@gmail.com", description: "User email" })
  @IsString({ message: "Must be a string" })
  @IsEmail({}, { message: "Incorrect email" })
  readonly email: string

  @ApiProperty({ example: "London", description: "Weather in current city" })
  @IsString({ message: "Must be a string" })
  readonly city: string
}
