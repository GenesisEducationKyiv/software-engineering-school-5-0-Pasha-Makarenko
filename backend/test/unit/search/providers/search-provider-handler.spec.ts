import { SearchProviderException } from "../../../../src/search/exceptions/search-provider.exception"
import { MockSearchProvider } from "../../../mocks/providers/search.provider.handler"

describe("SearchProviderHandler", () => {
  it("should return data when first handler succeeds", async () => {
    const handler1 = new MockSearchProvider(true)
    const handler2 = new MockSearchProvider(false)

    handler1.setNext(handler2)

    const result = await handler1.search("test")

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe("Test City")
  })

  it("should delegate to next handler when first handler returns no data", async () => {
    const handler1 = new MockSearchProvider(false)
    const handler2 = new MockSearchProvider(true)

    handler1.setNext(handler2)

    const result = await handler1.search("test")

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe("Test City")
  })

  it("should throw SearchProviderException when all handlers fail", async () => {
    const handler1 = new MockSearchProvider(false)
    const handler2 = new MockSearchProvider(false)

    handler1.setNext(handler2)

    await expect(handler1.search("test")).rejects.toThrow(
      SearchProviderException
    )
    await expect(handler1.search("test")).rejects.toThrow(
      "All weather providers failed to return data"
    )
  })

  it("should throw SearchProviderException when no next handler is set", async () => {
    const handler = new MockSearchProvider(false)

    await expect(handler.search("test")).rejects.toThrow(
      SearchProviderException
    )
  })

  it("should handle errors and delegate to next handler", async () => {
    const handler1 = new MockSearchProvider(false, true) // throws error
    const handler2 = new MockSearchProvider(true)

    handler1.setNext(handler2)

    const result = await handler1.search("test")

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe("Test City")
  })

  it("should throw original error when no next handler and error occurs", async () => {
    const handler = new MockSearchProvider(false, true)

    await expect(handler.search("test")).rejects.toThrow("Provider error")
  })

  it("should chain multiple handlers correctly", async () => {
    const handler1 = new MockSearchProvider(false)
    const handler2 = new MockSearchProvider(false)
    const handler3 = new MockSearchProvider(true)

    handler1.setNext(handler2)
    handler2.setNext(handler3)

    const result = await handler1.search("test")

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe("Test City")
  })

  it("should return the next handler when setting next", () => {
    const handler1 = new MockSearchProvider(false)
    const handler2 = new MockSearchProvider(false)

    const returnedHandler = handler1.setNext(handler2)

    expect(returnedHandler).toBe(handler2)
  })
})
