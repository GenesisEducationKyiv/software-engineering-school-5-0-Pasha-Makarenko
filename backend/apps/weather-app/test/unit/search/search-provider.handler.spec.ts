import {
  MockErrorSearchProviderProvider,
  MockSuccessSearchProvider
} from "../../mocks/providers/search.provider.handler"
import { citiesMock } from "../../mocks/data/search.mock"
import { ProviderException } from "../../../src/infrastructure/common/exceptions/provider.exception"

describe("SearchProviderHandler", () => {
  it("should return data from first provider if all providers succeed", async () => {
    const first = new MockSuccessSearchProvider()
    const second = new MockSuccessSearchProvider(citiesMock)
    first.setNext(second)

    const result = await first.search(citiesMock[0].name)
    expect(result).toEqual(citiesMock)
  })

  it("should return data from first provider if it succeeds", async () => {
    const first = new MockSuccessSearchProvider()
    const second = new MockErrorSearchProviderProvider(
      new ProviderException("Second provider failed")
    )
    first.setNext(second)

    const result = await first.search(citiesMock[0].name)
    expect(result).toEqual(citiesMock)
  })

  it("should proceed to next provider when first fails", async () => {
    const first = new MockErrorSearchProviderProvider(
      new ProviderException("First provider failed")
    )
    const second = new MockSuccessSearchProvider(citiesMock)
    first.setNext(second)

    const result = await first.search(citiesMock[0].name)
    expect(result).toEqual(citiesMock)
  })

  it("should throw SearchProviderException when all providers fail", async () => {
    const first = new MockErrorSearchProviderProvider(
      new ProviderException("First provider failed")
    )
    const secondError = new ProviderException("Second provider failed")
    const second = new MockErrorSearchProviderProvider(secondError)
    first.setNext(second)

    await expect(first.search(citiesMock[0].name)).rejects.toThrow(secondError)
  })

  it("should work correctly without next provider", async () => {
    const provider = new MockSuccessSearchProvider()

    const result = await provider.search(citiesMock[0].name)
    expect(result).toEqual(citiesMock)
  })
})
