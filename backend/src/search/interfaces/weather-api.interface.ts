export type WeatherApiSearch = WeatherApiSearchItem[]

export interface WeatherApiSearchItem {
  id: number
  name: string
  region: string
  country: string
  lat: number
  lon: number
  url: string
}
