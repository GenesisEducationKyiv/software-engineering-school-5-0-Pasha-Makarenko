import { setupServer } from "msw/node"
import { http, HttpResponse } from "msw"
import { weatherDataMock } from "./data/weather.mock"
import { citiesMock } from "./data/search.mock"
import { HttpStatus } from "@nestjs/common"

const weatherHandler = http.get(
  process.env["WEATHER_API_WEATHER_URL"]!,
  async ({ request }) => {
    const url = new URL(request.url)
    const city =
      url.searchParams.get("q") ||
      url.searchParams.get("latitude") + "," + url.searchParams.get("longitude")
    const days =
      url.searchParams.get("days") || url.searchParams.get("forecast_days")

    console.log(url.searchParams)

    if (!city || !days || city === "invalid_lat,invalid_lon") {
      return new HttpResponse(
        { message: "No matching location found." },
        { status: HttpStatus.BAD_REQUEST }
      )
    }

    return HttpResponse.json(weatherDataMock)
  }
)

const searchHandler = http.get(
  process.env["WEATHER_API_SEARCH_URL"]!,
  async ({ request }) => {
    const url = new URL(request.url)
    const city = url.searchParams.get("q") || url.searchParams.get("name")

    if (!city?.toString()) {
      return new HttpResponse(
        { message: "Parameter q is missing." },
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
