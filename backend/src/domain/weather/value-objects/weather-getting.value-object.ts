export class WeatherGetting {
  constructor(
    public readonly city: string,
    public readonly lon: number,
    public readonly lat: number,
    public readonly days: number
  ) {}

  static create(
    city: string,
    lon: number,
    lat: number,
    days: number
  ): WeatherGetting {
    return new WeatherGetting(city, lon, lat, days)
  }
}
