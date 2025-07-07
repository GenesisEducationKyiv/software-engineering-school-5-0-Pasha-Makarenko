import * as Joi from "joi"

export const openMeteoSearchItemSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  country: Joi.string().required()
})

export const openMeteoSearchSchema = Joi.object({
  results: Joi.array().items(openMeteoSearchItemSchema).required()
})
