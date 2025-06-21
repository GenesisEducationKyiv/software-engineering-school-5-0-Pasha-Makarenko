export interface WeatherData {
  location: {
    name: string
    country: string
    lat: number
    lon: number
  }
  forecast: WeatherDay[]
}

export interface WeatherDay {
  date: string
  mintemp: number
  maxtemp: number
  avgtemp: number
  text: string
  icon: string
  hours: WeatherHour[]
}

export interface WeatherHour {
  time: string
  temp: number
  wind: number
  humidity: number
  icon: string
}
