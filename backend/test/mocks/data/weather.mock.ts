import { WeatherData } from "../../../src/weather/interfaces/weather.interface"

export const weatherDataMock: WeatherData = {
  location: {
    name: "Test City",
    country: "Test Country",
    lat: 0,
    lon: 0
  },
  forecast: [
    {
      date: "2023-01-01",
      mintemp: 10,
      maxtemp: 20,
      avgtemp: 15,
      text: "Sunny",
      icon: "test-icon.png",
      hours: [
        {
          time: "2023-01-01 00:00",
          temp: 10,
          wind: 5,
          humidity: 60,
          icon: "test-icon.png"
        },
        {
          time: "2023-01-01 01:00",
          temp: 11,
          wind: 6,
          humidity: 61,
          icon: "test-icon.png"
        }
      ]
    },
    {
      date: "2023-01-02",
      mintemp: 12,
      maxtemp: 22,
      avgtemp: 17,
      text: "Cloudy",
      icon: "cloudy-icon.png",
      hours: []
    }
  ]
}
