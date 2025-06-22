import { openMeteoWeatherMapper } from "../../../../src/weather/mappers/open-meteo-weather.mapper"
import {
  cityMock,
  openMeteoDataMock
} from "../../../mocks/data/open-meteo.mock"

describe("openMeteoWeatherMapper", () => {
  it("should correctly map OpenMeteo data to WeatherData format", () => {
    const result = openMeteoWeatherMapper(openMeteoDataMock, cityMock)

    expect(result.location.name).toBe(cityMock.name)
    expect(result.location.country).toBe(cityMock.country)
    expect(result.location.lat).toBe(openMeteoDataMock.latitude)
    expect(result.location.lon).toBe(openMeteoDataMock.longitude)
  })

  it("should create forecast for each day", () => {
    const result = openMeteoWeatherMapper(openMeteoDataMock, cityMock)

    expect(result.forecast).toHaveLength(1)
    expect(result.forecast[0].date).toBe("2024-01-01")
  })

  it("should calculate correct temperature statistics", () => {
    const result = openMeteoWeatherMapper(openMeteoDataMock, cityMock)
    const forecast = result.forecast[0]

    expect(forecast.mintemp).toBe(-18)
    expect(forecast.maxtemp).toBe(5)
    const expectedAvg =
      openMeteoDataMock.hourly.temperature_2m.reduce(
        (sum, temp) => sum + temp,
        0
      ) / openMeteoDataMock.hourly.temperature_2m.length
    expect(forecast.avgtemp).toBe(expectedAvg)
  })

  it("should map hourly data correctly", () => {
    const result = openMeteoWeatherMapper(openMeteoDataMock, cityMock)
    const hours = result.forecast[0].hours

    expect(hours).toHaveLength(24)

    expect(hours[0].time).toBe("00:00:00")
    expect(hours[0].temp).toBe(5)
    expect(hours[0].wind).toBe(10)
    expect(hours[0].humidity).toBe(60)

    expect(hours[23].time).toBe("23:00:00")
    expect(hours[23].temp).toBe(-18)
    expect(hours[23].wind).toBe(33)
    expect(hours[23].humidity).toBe(83)
  })

  it("should handle day/night icon mapping", () => {
    const result = openMeteoWeatherMapper(openMeteoDataMock, cityMock)
    const hours = result.forecast[0].hours

    for (let i = 0; i < 12; i++) {
      expect(hours[i].icon).toBeDefined()
    }

    for (let i = 12; i < 24; i++) {
      expect(hours[i].icon).toBeDefined()
    }
  })

  it("should handle multiple days correctly", () => {
    const multiDayData = {
      ...openMeteoDataMock,
      hourly: {
        ...openMeteoDataMock.hourly,
        time: [
          ...openMeteoDataMock.hourly.time,
          ...openMeteoDataMock.hourly.time.map(t =>
            t.replace("2024-01-01", "2024-01-02")
          )
        ],
        temperature_2m: [
          ...openMeteoDataMock.hourly.temperature_2m,
          ...openMeteoDataMock.hourly.temperature_2m
        ],
        wind_speed_10m: [
          ...openMeteoDataMock.hourly.wind_speed_10m,
          ...openMeteoDataMock.hourly.wind_speed_10m
        ],
        relative_humidity_2m: [
          ...openMeteoDataMock.hourly.relative_humidity_2m,
          ...openMeteoDataMock.hourly.relative_humidity_2m
        ],
        weather_code: [
          ...openMeteoDataMock.hourly.weather_code,
          ...openMeteoDataMock.hourly.weather_code
        ],
        is_day: [
          ...openMeteoDataMock.hourly.is_day,
          ...openMeteoDataMock.hourly.is_day
        ]
      },
      daily: {
        time: ["2024-01-01", "2024-01-02"],
        weather_code: [0, 1]
      }
    }

    const result = openMeteoWeatherMapper(multiDayData, cityMock)

    expect(result.forecast).toHaveLength(2)
    expect(result.forecast[0].date).toBe("2024-01-01")
    expect(result.forecast[1].date).toBe("2024-01-02")
  })

  it("should handle empty hourly data", () => {
    const emptyData = {
      ...openMeteoDataMock,
      hourly: {
        time: [],
        temperature_2m: [],
        wind_speed_10m: [],
        relative_humidity_2m: [],
        weather_code: [],
        is_day: []
      },
      daily: {
        time: [],
        weather_code: []
      }
    }

    const result = openMeteoWeatherMapper(emptyData, cityMock)

    expect(result.forecast).toHaveLength(0)
  })
})
