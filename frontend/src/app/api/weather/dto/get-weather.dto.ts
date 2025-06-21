export interface GetWeatherDto {
  readonly city: string
  readonly lat: string
  readonly lon: string
  readonly days: string | number
}
