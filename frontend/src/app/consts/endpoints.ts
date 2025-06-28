import { environment } from "../../environments/environment"
import { GetWeatherDto } from "../api/weather/dto/get-weather.dto"

export const BASE_API_URL = environment.apiUrl + "/api"

export const ENDPOINTS = {
  subscribe: `${BASE_API_URL}/subscribe`,
  confirm: (token: string) => `${BASE_API_URL}/confirm/${token}`,
  unsubscribe: (token: string) => `${BASE_API_URL}/unsubscribe/${token}`,
  weather: (dto: GetWeatherDto) =>
    `${BASE_API_URL}/weather?city=${dto.city}&lat=${dto.lat}&lon=${dto.lon}&days=${dto.days}`,
  search: (city: string) => `${BASE_API_URL}/search?city=${city}`
}
