export class WeatherContext {
  constructor(
    public readonly city: string,
    public readonly country: string,
    public readonly date: string,
    public readonly description: string,
    public readonly temperature: number,
    public readonly hours: WeatherContextHour[]
  ) {}

  static create(
    city: string,
    country: string,
    date: string,
    description: string,
    temperature: number,
    hours: WeatherContextHour[]
  ): WeatherContext {
    return new WeatherContext(
      city,
      country,
      date,
      description,
      temperature,
      hours
    )
  }
}

export class WeatherContextHour {
  constructor(
    public readonly time: string,
    public readonly temperature: number,
    public readonly humidity: number,
    public readonly wind: number
  ) {}

  static create(
    time: string,
    temperature: number,
    humidity: number,
    wind: number
  ): WeatherContextHour {
    return new WeatherContextHour(time, temperature, humidity, wind)
  }
}
