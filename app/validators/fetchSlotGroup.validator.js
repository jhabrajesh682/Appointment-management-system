const Joi = require('@hapi/joi');

function validateSlotGroupFetch(slotGroup) {
    let schema = Joi.object({

        date: Joi.date().required(),
        medicalCenterId: Joi.string().required(),
        cityId: Joi.string().required(),

    })

    let result = schema.validate(slotGroup)
    // console.log(result);
    return result
}


module.exports.validateSlotGroupFetch = validateSlotGroupFetch



