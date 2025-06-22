import {
  citiesMock,
  distantLocation,
  targetLocation
} from "../../../mocks/data/search.mock"
import { findClosedCity } from "../../../../src/shared/utils/find-closed-city.util"

describe("findClosedCity", () => {
  it("should find the closest city when target is exactly at Paris coordinates", () => {
    const result = findClosedCity(
      citiesMock,
      targetLocation.lat,
      targetLocation.lon
    )

    expect(result.name).toBe("Paris")
    expect(result.country).toBe("France")
  })

  it("should find the closest city when target is far from all cities", () => {
    const result = findClosedCity(
      citiesMock,
      distantLocation.lat,
      distantLocation.lon
    )

    expect(result.name).toBe("Berlin")
    expect(result.country).toBe("Germany")
  })

  it("should handle empty cities array", () => {
    expect(() =>
      findClosedCity([], targetLocation.lat, targetLocation.lon)
    ).toThrow()
  })

  it("should handle single city", () => {
    const singleCity = [citiesMock[0]]
    const result = findClosedCity(
      singleCity,
      targetLocation.lat,
      targetLocation.lon
    )

    expect(result).toBe(singleCity[0])
  })

  it("should calculate distances correctly for different coordinates", () => {
    const londonTarget = { lat: "51.5074", lon: "-0.1278" }
    const result = findClosedCity(
      citiesMock,
      londonTarget.lat,
      londonTarget.lon
    )

    expect(result.name).toBe("London")
  })

  it("should handle string coordinates with different formats", () => {
    const result = findClosedCity(citiesMock, "48.8566", "2.3522")

    expect(result.name).toBe("Paris")
  })

  it("should return the same result for identical coordinates", () => {
    const result1 = findClosedCity(
      citiesMock,
      targetLocation.lat,
      targetLocation.lon
    )
    const result2 = findClosedCity(
      citiesMock,
      targetLocation.lat,
      targetLocation.lon
    )

    expect(result1).toEqual(result2)
  })
})
