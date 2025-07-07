import { ITransactionsManager } from "../../../src/application/common/interfaces/transaction.manager"
import { EntityManager } from "@mikro-orm/postgresql"

export const transactionsManagerMockFactory = () =>
  ({
    transaction: jest.fn(async callback => {
      try {
        return await callback({} as unknown as EntityManager)
      } catch (error) {
        throw new Error("Transaction failed")
      }
    })
  }) as ITransactionsManager
