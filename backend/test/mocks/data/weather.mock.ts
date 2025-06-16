import { WeatherData } from "../../../src/weather/interfaces/weather.interface"

export const weatherDataMock = {
  location: {
    name: "Test City",
    region: "Test Region",
    country: "Test Country",
    lat: 0,
    lon: 0,
    tz_id: "Test/Timezone",
    localtime_epoch: 0,
    localtime: "2023-01-01 00:00"
  },
  forecast: {
    forecastday: [
      {
        date: "2023-01-01",
        day: {
          condition: {
            text: "Sunny",
            icon: "test-icon.png"
          },
          avgtemp_c: 20,
          avgtemp_f: 68
        },
        hour: Array(24)
          .fill(null)
          .map((_, i) => ({
            time: `2023-01-01 ${i.toString().padStart(2, "0")}:00`,
            temp_c: 20 + i,
            temp_f: 68 + i,
            condition: {
              icon: "test-icon.png"
            },
            humidity: 50 + i,
            wind_kph: 10 + i,
            wind_mph: 6 + i
          }))
      },
      {
        date: "2023-01-02",
        day: {
          condition: {
            text: "Cloudy",
            icon: "cloudy-icon.png"
          },
          avgtemp_c: 18,
          avgtemp_f: 64
        },
        hour: []
      }
    ]
  }
} as never as WeatherData
