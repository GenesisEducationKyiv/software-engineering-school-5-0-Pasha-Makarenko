import { HttpStatus } from "@nestjs/common"
import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"
import { weatherDataMock } from "./data/weather.mock"
import { citiesMock } from "./data/search.mock"

const weatherHandler = http.get(
  process.env["WEATHER_API_WEATHER_URL"]!,
  async ({ request }) => {
    const url = new URL(request.url)
    const city =
      url.searchParams.get("q") ||
      url.searchParams.get("latitude") + "," + url.searchParams.get("longitude")
    const days =
      url.searchParams.get("days") || url.searchParams.get("forecast_days")

    if (!city || !days || city === "1,1") {
      return new HttpResponse(
        { message: "No matching location found." },
        { status: HttpStatus.BAD_REQUEST }
      )
    }

    const dynamicWeatherData = {
      ...weatherDataMock,
      location: {
        ...weatherDataMock.location,
        name: url.searchParams.get("q") || weatherDataMock.location.name
      }
    }

    return HttpResponse.json(dynamicWeatherData)
  }
)

const searchHandler = http.get(
  process.env["WEATHER_API_SEARCH_URL"]!,
  async ({ request }) => {
    const url = new URL(request.url)
    const city = url.searchParams.get("q") || url.searchParams.get("name")

    if (!city) {
      return new HttpResponse(
        { message: "City query parameter is required." },
        { status: HttpStatus.BAD_REQUEST }
      )
    }

    if (city === "invalid_city_query") {
      return HttpResponse.json([])
    }

    return HttpResponse.json(citiesMock)
  }
)

export const server = setupServer(weatherHandler, searchHandler)
