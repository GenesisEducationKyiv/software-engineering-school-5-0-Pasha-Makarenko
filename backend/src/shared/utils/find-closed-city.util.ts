import { City } from "../../search/interfaces/search.interface"

export const findClosedCity = (
  cities: City[],
  lat: string,
  lon: string
): City => {
  const array = [...cities]

  const vectors = array.map(city => {
    const latDiff = parseFloat(city.lat.toString()) - parseFloat(lat)
    const lonDiff = parseFloat(city.lon.toString()) - parseFloat(lon)
    return {
      city,
      distance: Math.sqrt(latDiff * latDiff + lonDiff * lonDiff)
    }
  })

  vectors.sort((a, b) => a.distance - b.distance)

  return vectors[0].city
}
