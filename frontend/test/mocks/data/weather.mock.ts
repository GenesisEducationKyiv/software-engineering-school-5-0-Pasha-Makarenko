import { WeatherState } from "../../../src/app/store/weather/weather.state"
import { WeatherData } from "../../../src/app/api/weather/weather.interface"

export const weatherDataMock: WeatherData = {
  location: {
    name: "Test City",
    country: "Test Country",
    lat: 0,
    lon: 0
  },
  forecast: [
    {
      date: "2023-10-01",
      icon: "sunny",
      text: "Sunny",
      avgtemp: 25,
      maxtemp: 30,
      mintemp: 20,
      hours: Array(24)
        .fill(null)
        .map(_ => ({
          wind: 0,
          humidity: 50,
          temp: 25,
          icon: "sunny",
          text: "Sunny",
          time: "00:00"
        }))
    }
  ]
}

export const weatherStateMock: WeatherState = {
  weather: {
    data: weatherDataMock,
    isLoading: false,
    error: null
  }
}
