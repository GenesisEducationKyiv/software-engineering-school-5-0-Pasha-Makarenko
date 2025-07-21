import { Module } from "@nestjs/common"
import { TRANSACTIONS_MANAGER } from "../../application/common/interfaces/transaction.manager"
import { TransactionsManager } from "../../infrastructure/common/persistance/managers/transactions.manager"
import { URL_GENERATOR_SERVICE } from "../../application/common/interfaces/url-generator.interfaces"
import { ConfigService } from "@nestjs/config"
import { UrlGeneratorService } from "../../infrastructure/common/services/url-generator.service"
import { TOKEN_SERVICE } from "../../application/common/interfaces/token-service.interface"
import { TokenService } from "../../infrastructure/common/services/token.service"

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
    },
    {
      provide: TOKEN_SERVICE,
      useClass: TokenService
    }
  ],
  exports: [TRANSACTIONS_MANAGER, URL_GENERATOR_SERVICE, TOKEN_SERVICE]
})
export class InfrastructureModule {}
