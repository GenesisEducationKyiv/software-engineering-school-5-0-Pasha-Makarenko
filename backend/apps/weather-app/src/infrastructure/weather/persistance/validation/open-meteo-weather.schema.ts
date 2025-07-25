import * as Joi from "joi"

export const openMeteoWeatherSchema = Joi.object({
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  hourly: Joi.object({
    time: Joi.array().items(Joi.string()).required(),
    temperature_2m: Joi.array().items(Joi.number()).required(),
    relative_humidity_2m: Joi.array().items(Joi.number()).required(),
    wind_speed_10m: Joi.array().items(Joi.number()).required(),
    weather_code: Joi.array().items(Joi.number()).required(),
    is_day: Joi.array().items(Joi.number().valid(0, 1)).required()
  }).required(),
  daily: Joi.object({
    time: Joi.array().items(Joi.string()).required(),
    weather_code: Joi.array().items(Joi.number()).required()
  }).required()
})
