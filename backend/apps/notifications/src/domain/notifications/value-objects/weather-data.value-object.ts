export class WeatherData {
  constructor(
    public readonly city: string,
    public readonly country: string,
    public readonly date: string,
    public readonly description: string,
    public readonly temperature: number,
    public readonly hours: WeatherHour[]
  ) {}

  static create(
    city: string,
    country: string,
    date: string,
    description: string,
    temperature: number,
    hours: WeatherHour[]
  ): WeatherData {
    return new WeatherData(city, country, date, description, temperature, hours)
  }
}

export class WeatherHour {
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
  ): WeatherHour {
    return new WeatherHour(time, temperature, humidity, wind)
  }
}
