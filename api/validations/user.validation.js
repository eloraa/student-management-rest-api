const Joi = require('joi')

module.exports = {
  replaceUser: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128).required(),
      name: Joi.string().max(128),
      class: Joi.number()
        .integer()
        .max(12)
        .required(),
      roll: Joi.number()
        .integer()
        .required()
    },
    params: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    }
  }
}