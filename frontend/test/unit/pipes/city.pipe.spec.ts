import { CityPipe } from "../../../src/app/pipes/city.pipe"
import { citiesMock } from "../../mocks/data/city.mock"

describe("CityPipe", () => {
  const pipe = new CityPipe()
  const mockCity = citiesMock[0]

  it("create an instance", () => {
    expect(pipe).toBeTruthy()
  })

  it("should return empty string for null city", () => {
    expect(pipe.transform(null, "")).toBe("")
  })

  it("should format city name only", () => {
    expect(pipe.transform(mockCity, "$n")).toBe(mockCity.name)
  })

  it("should format city with region", () => {
    expect(pipe.transform(mockCity, "$n ($r)")).toBe(
      `${mockCity.name} (${mockCity.region})`
    )
  })

  it("should format city with country", () => {
    expect(pipe.transform(mockCity, "$n ($c)")).toBe(
      `${mockCity.name} (${mockCity.country})`
    )
  })

  it("should handle unknown placeholders", () => {
    expect(pipe.transform(mockCity, "$n ($x)")).toBe(`${mockCity.name} ($x)`)
  })
})
