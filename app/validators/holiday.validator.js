const Joi = require('@hapi/joi');

function validateHoliday(holiday) {
    let schema = Joi.object({

        holidayName:Joi.string().required(),
        holidayDiscription:Joi.string().required(),
        date:Joi.date().required(),
    
        timeZone:Joi.string().required(),
        country:Joi.object({
            countryId:Joi.string().required(),
            countryName:Joi.string().required(),
        }).required(),
        city:Joi.object({
            cityId:Joi.string().required(),
            cityName:Joi.string().required(),
        }).required(),
        
    })

    let result = schema.validate(holiday)
    // console.log(result);
    return result
}


function validateUpdateHoliday(holiday) {
    let schema = Joi.object({

        holidayName:Joi.string(),
        holidayDiscription:Joi.string(),
        date:Joi.date(),
        
        timeZone:Joi.string(),
        country:Joi.object({
            countryId:Joi.string(),
            countryName:Joi.string(),
        }),
        city:Joi.object({
            cityId:Joi.string(),
            cityName:Joi.string(),
        }),
        
    })

    let result = schema.validate(holiday)
    // console.log(result);
    return result
}

module.exports.validateHoliday = validateHoliday
module.exports.validateUpdateHoliday = validateUpdateHoliday
