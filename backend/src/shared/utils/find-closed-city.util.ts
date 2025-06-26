import { City } from "../../search/interfaces/search.interface"

export const findClosedCity = (
  cities: City[],
  lat: number,
  lon: number
): City => {
  const array = [...cities]

  const vectors = array.map(city => {
    const latDiff = parseFloat(city.lat.toString()) - lat
    const lonDiff = parseFloat(city.lon.toString()) - lon
    return {
      city,
      distance: Math.sqrt(latDiff * latDiff + lonDiff * lonDiff)
    }
  })

  vectors.sort((a, b) => a.distance - b.distance)

  return vectors[0].city
}
