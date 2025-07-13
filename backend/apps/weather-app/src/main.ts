import { NestFactory } from "@nestjs/core"
import { WeatherAppModule } from "./main/weather-app.module"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { ValidationPipe } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { Logger } from "nestjs-pino"
import { InvalidDataException } from "./domain/common/exceptions/invalid-data.exception"
import { GlobalExceptionFilter } from "./presentation/common/filters/global.exception.filter"
import { exceptionFilters } from "./presentation/common/filters/exception.filters"

async function bootstrap() {
  const app = await NestFactory.create(WeatherAppModule)
  const configService = app.get(ConfigService)
  const logger = app.get(Logger)

  app.enableCors({
    origin: configService.get<string>("CLIENT_URL")
  })
  app.setGlobalPrefix("api")
  app.useLogger(logger)
  app.useGlobalFilters(new GlobalExceptionFilter(exceptionFilters))

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

  await app.listen(configService.get<string>("WEATHER_APP_PORT")!)
}

bootstrap()
