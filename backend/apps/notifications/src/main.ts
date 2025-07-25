import { NestFactory } from "@nestjs/core"
import { NotificationsModule } from "./main/notifications.module"
import { Logger } from "nestjs-pino"
import { ValidationPipe } from "@nestjs/common"
import { InvalidDataException } from "./domain/common/exceptions/invalid-data.exception"
import { GlobalExceptionFilter } from "./presentation/common/filters/global.exception.filter"
import { exceptionFilters } from "./presentation/common/filters/exception.filters"
import { AsyncMicroserviceOptions, Transport } from "@nestjs/microservices"
import { ConfigService } from "@nestjs/config"
import { getRabbitMqConfig } from "./main/config/rabbitmq.config"

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule)
  const configService = app.get(ConfigService)
  const logger = app.get(Logger)

  app.enableCors({
    origin: "*"
  })
  app.setGlobalPrefix("api")
  app.useLogger(logger)
  app.useGlobalFilters(new GlobalExceptionFilter(exceptionFilters))
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

  app.connectMicroservice<AsyncMicroserviceOptions>({
    useFactory: (configService: ConfigService) => ({
      transport: Transport.RMQ,
      options: getRabbitMqConfig(configService)
    }),
    inject: [ConfigService]
  })

  await app.startAllMicroservices()
  await app.listen(configService.get<string>("NOTIFICATIONS_PORT")!)
}

bootstrap()
