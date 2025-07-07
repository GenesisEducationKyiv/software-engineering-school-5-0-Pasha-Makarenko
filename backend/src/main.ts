import { NestFactory } from "@nestjs/core"
import { AppModule } from "./main/app.module"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { ValidationPipe } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { Logger } from "nestjs-pino"
import { InvalidDataException } from "./domain/common/exceptions/invalid-data.exception"
import { ConflictExceptionFilter } from "./presentation/common/filters/conflict.exception.filter"
import { InvalidDataExceptionFilter } from "./presentation/common/filters/invalid-data.exception.filter"
import { NotFoundExceptionFilter } from "./presentation/common/filters/not-found.exception.filter"
import { MailSendingFailedExceptionFilter } from "./presentation/common/filters/mail-sending-failed.exception.filter"
import { ProviderExceptionFilter } from "./presentation/common/filters/provider.exception.filter"
import { TransactionExceptionFilter } from "./presentation/common/filters/transaction.exception.filter"
import { UnauthorizedExceptionFilter } from "./presentation/common/filters/unauthorized.exception.filter"
import { GlobalExceptionFilter } from "./presentation/common/filters/global.exception.filter"
import { exceptionFilters } from "./presentation/common/filters/exception.filters"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const logger = app.get(Logger)

  app.enableCors({
    origin: configService.get<string>("CLIENT_URL")
  })
  app.setGlobalPrefix("api")
  app.useLogger(logger)

  const config = new DocumentBuilder()
    .setTitle("Weather")
    .setDescription("Server side Weather application")
    .setVersion("0.0.0")
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("/api/docs", app, document)

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: errors => {
        return new InvalidDataException(
          JSON.stringify(
            errors.map(error => ({
              property: error.property,
              constraints: error.constraints
            }))
          )
        )
      }
    })
  )

  app.useGlobalFilters(new GlobalExceptionFilter(exceptionFilters))

  await app.listen(configService.get<string>("API_PORT")!)
}

bootstrap()
