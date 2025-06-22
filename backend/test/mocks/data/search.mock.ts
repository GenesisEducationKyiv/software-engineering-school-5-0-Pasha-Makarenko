import { City } from "../../../src/search/interfaces/search.interface"

export const citiesMock: City[] = [
  {
    id: 1,
    name: "Paris",
    country: "France",
    lat: 48.8566,
    lon: 2.3522,
    url: "paris-france"
  },
  {
    id: 2,
    name: "London",
    country: "United Kingdom",
    lat: 51.5074,
    lon: -0.1278,
    url: "london-united-kingdom"
  },
  {
    id: 3,
    name: "Berlin",
    country: "Germany",
    lat: 52.52,
    lon: 13.405,
    url: "berlin-germany"
  },
  {
    id: 4,
    name: "Madrid",
    country: "Spain",
    lat: 40.4168,
    lon: -3.7038,
    url: "madrid-spain"
  },
  {
    id: 5,
    name: "Rome",
    country: "Italy",
    lat: 41.9028,
    lon: 12.4964,
    url: "rome-italy"
  }
]

export const targetLocation = {
  lat: "48.8566",
  lon: "2.3522"
}

export const distantLocation = {
  lat: "60.0000",
  lon: "10.0000"
}
