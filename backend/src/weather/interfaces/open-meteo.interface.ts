export interface OpenMeteoData {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string
  elevation: number
  hourly: {
    time: string[]
    temperature_2m: number[]
    relative_humidity_2m: number[]
    wind_speed_10m: number[]
    weather_code: number[]
    iss_day: number[]
  }
  daily: {
    time: string[]
    weather_code: number[]
  }
}
