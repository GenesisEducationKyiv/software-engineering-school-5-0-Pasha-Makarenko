import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min
} from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"

export class WeatherQueryDto {
  @ApiProperty({ example: "London", description: "Weather in current city" })
  @IsString({ message: "Must be a string" })
  @IsNotEmpty({ message: "City name cannot be empty" })
  readonly city: string

  @ApiProperty({ example: 51.5074, description: "Latitude of the location" })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber({}, { message: "Must be a string" })
  @Min(-90, { message: "Must be greater than -90" })
  @Max(90, { message: "Must be less than 90" })
  readonly lat: number

  @ApiProperty({ example: -0.1278, description: "Longitude of the location" })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber({}, { message: "Must be a number" })
  @Min(-180, { message: "Must be greater than -180" })
  @Max(180, { message: "Must be less than 180" })
  readonly lon: number

  @ApiProperty({ example: 1, description: "Days count" })
  @Transform(({ value }) => parseInt(value))
  @IsNumber({}, { message: "Must be a number" })
  @IsInt({ message: "Must be an integer" })
  @IsPositive({ message: "Must be a positive number" })
  readonly days: number
}
