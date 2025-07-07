import { EntityManager } from "@mikro-orm/postgresql"

export const TRANSACTIONS_MANAGER = "TRANSACTION_MANAGER"

export interface ITransactionsManager {
  transaction<T>(callback: (em: EntityManager) => Promise<T>): Promise<T>
}
