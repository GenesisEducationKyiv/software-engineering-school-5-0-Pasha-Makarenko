import { City } from "../../../src/search/interfaces/search.interface"

export const citiesMock: City[] = [
  {
    id: 1,
    name: "London",
    region: "England",
    country: "United Kingdom",
    lat: 51.5074,
    lon: -0.1278,
    url: "london-united-kingdom"
  },
  {
    id: 2,
    name: "New York",
    region: "New York",
    country: "United States",
    lat: 40.7128,
    lon: -74.006,
    url: "new-york-united-states"
  },
  {
    id: 3,
    name: "Tokyo",
    region: "Tokyo",
    country: "Japan",
    lat: 35.6762,
    lon: 139.6503,
    url: "tokyo-japan"
  },
  {
    id: 4,
    name: "Sydney",
    region: "New South Wales",
    country: "Australia",
    lat: -33.8688,
    lon: 151.2093,
    url: "sydney-australia"
  }
]
