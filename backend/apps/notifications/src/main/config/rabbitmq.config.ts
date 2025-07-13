import { ConfigService } from "@nestjs/config"

export const getRabbitMqConfig = (configService: ConfigService) => {
  const user = configService.get<string>("RABBITMQ_USER")
  const password = configService.get<string>("RABBITMQ_PASSWORD")
  const host = configService.get<string>("RABBITMQ_HOST")
  const port = configService.get<number>("RABBITMQ_PORT")

  return {
    urls: [`amqp://${user}:${password}@${host}:${port}`],
    queue: "notifications",
    queueOptions: {
      durable: true
    }
  }
}
