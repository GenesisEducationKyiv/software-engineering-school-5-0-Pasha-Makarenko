import { Module } from "@nestjs/common"
import { CqrsModule } from "@nestjs/cqrs"
import { UrlGeneratorService } from "./services/url-generator.service"

@Module({
  imports: [CqrsModule],
  providers: [UrlGeneratorService],
  exports: [UrlGeneratorService]
})
export class UrlGeneratorModule {}
