import { generateToken } from "../../../../src/shared/utils/token.util"
import * as crypto from "crypto"

describe("generateToken", () => {
  it("should generate a 64-character hex string", () => {
    const token = generateToken()
    expect(token).toHaveLength(64)
    expect(token).toMatch(/^[0-9a-f]+$/)
  })

  it("should generate unique tokens", () => {
    const token1 = generateToken()
    const token2 = generateToken()
    expect(token1).not.toBe(token2)
  })

  it("should use crypto.randomBytes for generation", () => {
    const mockRandomBytes = jest
      .spyOn(crypto, "randomBytes")
      .mockReturnValue(Buffer.from("test-token", "utf8") as unknown as void)

    const token = generateToken()
    expect(token).toBe("746573742d746f6b656e")
    expect(mockRandomBytes).toHaveBeenCalledWith(32)

    mockRandomBytes.mockRestore()
  })
})
