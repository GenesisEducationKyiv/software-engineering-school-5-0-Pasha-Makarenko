import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import {
  URL_GENERATOR_SERVICE,
  UrlGeneratorService
} from "./services/url-generator.service"
import { ConfigService } from "@nestjs/config"

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
