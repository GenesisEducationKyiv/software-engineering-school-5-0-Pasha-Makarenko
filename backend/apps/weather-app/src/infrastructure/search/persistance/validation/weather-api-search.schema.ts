import * as Joi from "joi"

export const weatherApiSearchItemSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
  country: Joi.string().required(),
  lat: Joi.number().required(),
  lon: Joi.number().required(),
  url: Joi.string().required()
})

export const weatherApiSearchSchema = Joi.array().items(
  weatherApiSearchItemSchema
)
