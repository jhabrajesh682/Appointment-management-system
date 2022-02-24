const Joi = require('@hapi/joi');

function validateEvents(event) {
    let schema = Joi.object({

        title: Joi.string().required(),
        holidayDiscription: Joi.string().required(),
        start: Joi.date().required(),
        end: Joi.date().required(),
        className: Joi.string().required(),
        timeZone: Joi.string().required(),
        country: Joi.object({
            countryId: Joi.string().required(),
            countryName: Joi.string().required(),
        }).required(),
        city: Joi.object({
            cityId: Joi.string().required(),
            cityName: Joi.string().required(),
        }).required(),


    })

    let result = schema.validate(event)
    // console.log(result);
    return result
}


function validateUpdateEvents(event) {
    let schema = Joi.object({

        title: Joi.string(),
        holidayDiscription: Joi.string(),
        start: Joi.date(),
        end: Joi.date(),



    })

    let result = schema.validate(event)
    // console.log(result);
    return result
}

module.exports.validateEvents = validateEvents
module.exports.validateUpdateEvents = validateUpdateEvents
