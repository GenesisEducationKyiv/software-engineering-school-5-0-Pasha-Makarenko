import * as Joi from "joi"

export const postgresSchema = Joi.object({
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().port().required()
})

export const redisSchema = Joi.object({
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().port().required(),
  WEATHER_CACHE_TTL: Joi.number().required(),
  SEARCH_CACHE_TTL: Joi.number().required()
})

export const rabbitMQSchema = Joi.object({
  RABBITMQ_HOST: Joi.string().required(),
  RABBITMQ_PORT: Joi.number().port().required(),
  RABBITMQ_USER: Joi.string().required(),
  RABBITMQ_PASSWORD: Joi.string().required()
})

export const weatherAppSchema = Joi.object({
  WEATHER_APP_PORT: Joi.number().port().required(),
  WEATHER_APP_URL: Joi.string().uri().required()
})

export const clientSchema = Joi.object({
  CLIENT_PORT: Joi.number().port().required(),
  CLIENT_URL: Joi.string().uri().required()
})

export const metricsSchema = Joi.object({
  PROMETHEUS_PORT: Joi.number().port().required(),
  LOKI_PORT: Joi.number().port().required(),
  LOKI_HOST: Joi.string().uri().required(),
  GRAFANA_PORT: Joi.number().port().required(),
  GRAFANA_USER: Joi.string().required(),
  GRAFANA_PASSWORD: Joi.string().required()
})

export const searchSchema = Joi.object({
  WEATHER_API_SEARCH_URL: Joi.string().uri().required(),
  WEATHER_API_SEARCH_KEY: Joi.string().required(),
  OPEN_METEO_SEARCH_URL: Joi.string().uri().required(),
  OPEN_METEO_SEARCH_KEY: Joi.string()
})

export const weatherSchema = Joi.object({
  WEATHER_API_WEATHER_URL: Joi.string().uri().required(),
  WEATHER_API_WEATHER_KEY: Joi.string().required(),
  OPEN_METEO_WEATHER_URL: Joi.string().uri().required(),
  OPEN_METEO_WEATHER_KEY: Joi.string()
})

export const nodeEnvSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("production")
})

export const configValidationSchema = Joi.object()
  .concat(postgresSchema)
  .concat(redisSchema)
  .concat(rabbitMQSchema)
  .concat(weatherAppSchema)
  .concat(clientSchema)
  .concat(metricsSchema)
  .concat(searchSchema)
  .concat(weatherSchema)
  .concat(nodeEnvSchema)
