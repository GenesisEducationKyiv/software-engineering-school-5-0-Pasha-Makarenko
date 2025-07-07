import { Module } from "@nestjs/common"
import { TRANSACTIONS_MANAGER } from "../../application/common/interfaces/transaction.manager"
import { TransactionsManager } from "../../infrastructure/common/persistance/managers/transactions.manager"

@Module({
  providers: [
    {
      provide: TRANSACTIONS_MANAGER,
      useClass: TransactionsManager
    }
  ],
  exports: [TRANSACTIONS_MANAGER]
})
export class TransactionsModule {}
