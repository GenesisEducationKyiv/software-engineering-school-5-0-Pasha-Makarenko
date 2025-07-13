import * as Joi from "joi"

export const weatherApiWeatherSchema = Joi.object({
  location: Joi.object({
    name: Joi.string().required(),
    country: Joi.string().required(),
    lat: Joi.number().required(),
    lon: Joi.number().required()
  }).required(),
  forecast: Joi.object({
    forecastday: Joi.array()
      .items(
        Joi.object({
          date: Joi.string().required(),
          day: Joi.object({
            maxtemp_c: Joi.number().required(),
            mintemp_c: Joi.number().required(),
            avgtemp_c: Joi.number().required(),
            condition: Joi.object({
              text: Joi.string().required(),
              icon: Joi.string().required()
            }).required()
          }).required(),
          hour: Joi.array()
            .items(
              Joi.object({
                time: Joi.string().required(),
                temp_c: Joi.number().required(),
                wind_kph: Joi.number().required(),
                humidity: Joi.number().required(),
                condition: Joi.object({
                  icon: Joi.string().required()
                }).required()
              })
            )
            .required()
        })
      )
      .required()
  }).required()
})
