import { setupServer } from "msw/node"
import { http, HttpResponse } from "msw"
import { WeatherApiConst } from "../../src/url-generator/consts/weather-api.const"
import { weatherDataMock } from "./data/weather.mock"
import { citiesMock } from "./data/search.mock"

const weatherHandler = http.get(
  process.env["WEATHER_API_URL"] + WeatherApiConst.weather,
  async ({ request }) => {
    const url = new URL(request.url)
    const city = url.searchParams.get("q")
    const days = url.searchParams.get("days")

    if (!city || !days || city === "invalid_city_query") {
      return new HttpResponse(
        { message: "No matching location found." },
        { status: 400 }
      )
    }

    return HttpResponse.json(weatherDataMock)
  }
)

const searchHandler = http.get(
  process.env["WEATHER_API_URL"] + WeatherApiConst.search,
  async ({ request }) => {
    const url = new URL(request.url)
    const city = url.searchParams.get("q")

    if (!city?.toString()) {
      return new HttpResponse(
        { message: "Parameter q is missing." },
        { status: 400 }
      )
    }

    if (city === "invalid_city_query") {
      return HttpResponse.json([])
    }

    return HttpResponse.json(citiesMock)
  }
)

export const server = setupServer(weatherHandler, searchHandler)
