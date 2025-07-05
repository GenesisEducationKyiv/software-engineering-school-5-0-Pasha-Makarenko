import { IHandler } from "../interfaces/handler.interface"

export const setupChain = <T extends IHandler>(providers: T[]) => {
  providers.reduce((prev, curr) => {
    if (curr) {
      prev.setNext(curr)
    }
    return curr
  })
  return providers[0]
}
