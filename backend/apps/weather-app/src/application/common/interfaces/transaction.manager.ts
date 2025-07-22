export const TRANSACTIONS_MANAGER = "TRANSACTION_MANAGER"

export interface ITransactionsManager {
  transaction<T>(callback: (em: unknown) => Promise<T>): Promise<T>
}
