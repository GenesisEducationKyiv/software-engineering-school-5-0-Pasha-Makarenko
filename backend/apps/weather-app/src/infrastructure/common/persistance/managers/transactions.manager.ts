import { Injectable, Scope } from "@nestjs/common"
import { EntityManager } from "@mikro-orm/postgresql"
import { TransactionException } from "../../exceptions/transaction.exception"
import { ITransactionsManager } from "../../../../application/common/interfaces/transaction.manager"

@Injectable({ scope: Scope.REQUEST })
export class TransactionsManager implements ITransactionsManager {
  constructor(private readonly em: EntityManager) {}

  async transaction<T>(
    callback: (em: EntityManager) => Promise<T>
  ): Promise<T> {
    try {
      return await this.em.transactional(
        async (transactionalEm: EntityManager) => {
          return await callback(transactionalEm)
        }
      )
    } catch (error) {
      throw new TransactionException(
        "Transaction failed",
        error instanceof Error ? error.message : "Unknown error"
      )
    }
  }
}
