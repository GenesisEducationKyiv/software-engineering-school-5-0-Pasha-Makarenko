import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { ValidationPipe } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { GlobalExceptionFilter } from "./shared/filters/global-exception.filter"

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log"]
  })
  const configService = app.get(ConfigService)
  app.enableCors({
    origin: configService.get<string>("CLIENT_URL")
  })
  app.setGlobalPrefix("api")

  const config = new DocumentBuilder()
    .setTitle("Weather")
    .setDescription("Server side Weather application")
    .setVersion("0.0.0")
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("/api/docs", app, document)

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  )

  app.useGlobalFilters(new GlobalExceptionFilter())

  await app.listen(configService.get<string>("API_PORT")!)
}

bootstrap()
