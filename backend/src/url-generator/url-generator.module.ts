import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { UrlGeneratorService } from "./services/url-generator.service"
import { ConfigService } from "@nestjs/config"

@Module({
  imports: [CqrsModule],
  providers: [
    {
      provide: UrlGeneratorService,
      useFactory: (configService: ConfigService) =>
        new UrlGeneratorService(configService.get<string>("CLIENT_URL")!),
      inject: [ConfigService]
    }
  ],
  exports: [UrlGeneratorService]
})
export class UrlGeneratorModule {}
