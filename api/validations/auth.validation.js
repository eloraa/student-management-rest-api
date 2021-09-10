const Joi = require('joi');

module.exports = {
    register: {
        body: {
            name: Joi.string()
                .max(50)
                .min(3)
                .required(),
            email: Joi.string()
                .email()
                .required(),
            password: Joi.string()
                .min(6)
                .max(128)
                .required(),
            class: Joi.number()
                .integer()
                .max(12)
                .required(),
            roll: Joi.number()
                .integer()
                .required()
        }
    },
    login: {
        body: {
            email: Joi.string()
                .email()
                .required(),
            password: Joi.string()
                .required()
                .max(128),
        }
    }
}