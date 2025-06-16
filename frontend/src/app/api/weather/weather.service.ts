import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { GetWeatherDto } from "./dto/get-weather.dto"
import { WeatherData } from "./weather.interface"
import { ENDPOINTS } from "../../consts/endpoints"

@Injectable({
  providedIn: "root"
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  getWeather(dto: GetWeatherDto) {
    return this.http.get<WeatherData>(ENDPOINTS.weather(dto.city, dto.days))
  }
}
