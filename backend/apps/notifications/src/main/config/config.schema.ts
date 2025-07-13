import * as Joi from "joi"

export const rabbitMQSchema = Joi.object({
  RABBITMQ_HOST: Joi.string().required(),
  RABBITMQ_PORT: Joi.number().port().required(),
  RABBITMQ_USER: Joi.string().required(),
  RABBITMQ_PASSWORD: Joi.string().required()
})

export const smtpSchema = Joi.object({
  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().port().required(),
  SMTP_USER: Joi.string().email().required(),
  SMTP_PASSWORD: Joi.string().required()
})

export const notificationsSchema = Joi.object({
  NOTIFICATIONS_PORT: Joi.number().port().required(),
  NOTIFICATIONS_URL: Joi.string().uri().required()
})

export const metricsSchema = Joi.object({
  PROMETHEUS_PORT: Joi.number().port().required(),
  LOKI_PORT: Joi.number().port().required(),
  LOKI_HOST: Joi.string().uri().required(),
  GRAFANA_PORT: Joi.number().port().required(),
  GRAFANA_USER: Joi.string().required(),
  GRAFANA_PASSWORD: Joi.string().required()
})

export const nodeEnvSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("production")
})

export const configValidationSchema = Joi.object()
  .concat(rabbitMQSchema)
  .concat(smtpSchema)
  .concat(notificationsSchema)
  .concat(metricsSchema)
  .concat(nodeEnvSchema)
