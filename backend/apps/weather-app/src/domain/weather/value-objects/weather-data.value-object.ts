export class WeatherData {
  constructor(
    public readonly location: WeatherLocation,
    public readonly forecast: WeatherDay[]
  ) {}

  static create(
    location: WeatherLocation,
    forecast: WeatherDay[]
  ): WeatherData {
    return new WeatherData(location, forecast)
  }
}

export class WeatherLocation {
  constructor(
    public readonly name: string,
    public readonly country: string,
    public readonly lat: number,
    public readonly lon: number
  ) {}

  static create(
    name: string,
    country: string,
    lat: number,
    lon: number
  ): WeatherLocation {
    return new WeatherLocation(name, country, lat, lon)
  }
}

export class WeatherDay {
  constructor(
    public readonly date: string,
    public readonly mintemp: number,
    public readonly maxtemp: number,
    public readonly avgtemp: number,
    public readonly text: string,
    public readonly icon: string,
    public readonly hours: WeatherHour[]
  ) {}

  static create(
    date: string,
    mintemp: number,
    maxtemp: number,
    avgtemp: number,
    text: string,
    icon: string,
    hours: WeatherHour[]
  ): WeatherDay {
    return new WeatherDay(date, mintemp, maxtemp, avgtemp, text, icon, hours)
  }
}

export class WeatherHour {
  constructor(
    public readonly time: string,
    public readonly temp: number,
    public readonly wind: number,
    public readonly humidity: number,
    public readonly icon: string
  ) {}

  static create(
    time: string,
    temp: number,
    wind: number,
    humidity: number,
    icon: string
  ): WeatherHour {
    return new WeatherHour(time, temp, wind, humidity, icon)
  }
}
