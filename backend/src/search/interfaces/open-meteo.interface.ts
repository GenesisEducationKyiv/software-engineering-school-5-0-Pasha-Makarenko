export interface OpenMeteoSearch {
  results: OpenMeteoSearchItem[]
}

export interface OpenMeteoSearchItem {
  id: number
  name: string
  latitude: number
  longitude: number
  elevation: number
  feature_code: string
  country_code: string
  admin1_id: number
  admin2_id: number
  admin3_id: number
  admin4_id: number
  timezone: string
  population: number
  postcodes: string[]
  country_id: number
  country: string
}
