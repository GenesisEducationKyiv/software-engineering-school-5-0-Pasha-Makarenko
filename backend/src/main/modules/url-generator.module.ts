import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { ConfigService } from "@nestjs/config"
import { UrlGeneratorService } from "../../infrastructure/url-generator/services/url-generator.service"
import { URL_GENERATOR_SERVICE } from "../../infrastructure/url-generator/interfaces/url-generator.interfaces"

@Module({
  imports: [CqrsModule],
  providers: [
    {
      provide: URL_GENERATOR_SERVICE,
      useFactory: (configService: ConfigService) =>
        new UrlGeneratorService(configService.get<string>("CLIENT_URL")!),
      inject: [ConfigService]
    }
  ],
  exports: [URL_GENERATOR_SERVICE]
})
export class UrlGeneratorModule {}
