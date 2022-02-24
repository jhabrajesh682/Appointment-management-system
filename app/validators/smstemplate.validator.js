const Joi = require('@hapi/joi');

function validateSmsTemplate(sms) {
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

        body: Joi.string().required(),
        htmlBody: Joi.string().required(),
        operation: Joi.array().required(),
        type: Joi.string().required()

    })

    let result = schema.validate(sms)
    return result
}


function validateUpdateSmsTemplate(sms) {
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

        body: Joi.string(),
        htmlBody: Joi.string(),
        operation: Joi.array(),
        type: Joi.string()

    })

    let result = schema.validate(sms)
    return result
}

module.exports.validateSmsTemplate = validateSmsTemplate
module.exports.validateUpdateSmsTemplate = validateUpdateSmsTemplate
