const Joi = require('@hapi/joi');

function validateEmailTemplate(email) {
    let schema = Joi.object({

        country: Joi.object({
            countryId: Joi.string().required(),
            countryName: Joi.string().required(),
        }).required(),
        city: Joi.object({
            cityId: Joi.string().required(),
            cityName: Joi.string().required(),
        }).required(),
        medicalCenter: Joi.object({
            medicalCenterId: Joi.string().required(),
            medicalCenterName: Joi.string().required(),
        }).required(),

        subject: Joi.string().required(),
        body: Joi.string().required(),
        htmlBody: Joi.string().required(),
        operation: Joi.array().required(),
        type: Joi.string().required()

    })

    let result = schema.validate(email)
    return result
}


function validateUpdateEmailTemplate(email) {
    let schema = Joi.object({


        country: Joi.object({
            countryId: Joi.string(),
            countryName: Joi.string(),
        }),
        city: Joi.object({
            cityId: Joi.string(),
            cityName: Joi.string(),
        }),
        medicalCenter: Joi.object({
            medicalCenterId: Joi.string(),
            medicalCenterName: Joi.string(),
        }),

        subject: Joi.string(),
        body: Joi.string(),
        htmlBody: Joi.string(),
        operation: Joi.array(),
        type: Joi.string()

    })

    let result = schema.validate(email)
    return result
}

module.exports.validateEmailTemplate = validateEmailTemplate
module.exports.validateUpdateEmailTemplate = validateUpdateEmailTemplate
