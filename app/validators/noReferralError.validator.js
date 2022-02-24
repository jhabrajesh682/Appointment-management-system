const Joi = require('@hapi/joi');

function validateNoReferralError(email) {
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
            qvcCode: Joi.string().required()

        }).required(),


        body: Joi.string().required(),
        htmlBody: Joi.string().required(),
        operation: Joi.array().required(),


    })

    let result = schema.validate(email)
    return result
}


function validateUpdateNoReferralError(email) {
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
            qvcCode: Joi.string()
        }),

        body: Joi.string(),
        htmlBody: Joi.string(),
        operation: Joi.array()

    })

    let result = schema.validate(email)
    return result
}

module.exports.validateNoReferralError = validateNoReferralError
module.exports.validateUpdateNoReferralError = validateUpdateNoReferralError
