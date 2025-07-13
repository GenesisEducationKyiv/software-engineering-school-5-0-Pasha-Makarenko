import { Module } from "@nestjs/common"
import { TRANSACTIONS_MANAGER } from "../../application/common/interfaces/transaction.manager"
import { TransactionsManager } from "../../infrastructure/common/persistance/managers/transactions.manager"
import { URL_GENERATOR_SERVICE } from "../../application/common/interfaces/url-generator.interfaces"
import { ConfigService } from "@nestjs/config"
import { UrlGeneratorService } from "../../infrastructure/common/services/url-generator.service"

@Module({
  providers: [
    {
      provide: TRANSACTIONS_MANAGER,
      useClass: TransactionsManager
    },
    {
      provide: URL_GENERATOR_SERVICE,
      useFactory: (configService: ConfigService) =>
        new UrlGeneratorService(configService.get<string>("CLIENT_URL")!),
      inject: [ConfigService]
    }
  ],
  exports: [TRANSACTIONS_MANAGER, URL_GENERATOR_SERVICE]
})
export class InfrastructureModule {}
