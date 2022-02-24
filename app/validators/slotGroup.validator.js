const Joi = require('@hapi/joi');

function validateSlotGroup(slotGroup) {
    let schema = Joi.object({

        date: Joi.date().required(),
        country:Joi.object({
            countryId:Joi.string().required(),
            countryName:Joi.string().required(),
        }).required(),
        city:Joi.object({
            cityId:Joi.string().required(),
            cityName:Joi.string().required(),
        }).required(),
        medicalCenter:Joi.object({
            medicalCenterId:Joi.string().required(),
            medicalCenterName:Joi.string().required(),
        }).required(),
        timeZone: Joi.string().required(),

        loggedUserID: Joi.string().required(),

        loggedDate: Joi.date().required(),

        templateId: Joi.string().required(),
        isPublished: Joi.boolean().required()


    })

    let result = schema.validate(slotGroup)
    // console.log(result);
    return result
}


function validateUpdateSlotGroup(slotGroup) {
    let schema = Joi.object({

        date: Joi.date(),
        country:Joi.object({
            countryId:Joi.string(),
            countryName:Joi.string(),
        }),
        city:Joi.object({
            cityId:Joi.string(),
            cityName:Joi.string(),
        }),
        medicalCenter:Joi.object({
            medicalCenterId:Joi.string(),
            medicalCenterName:Joi.string(),
        }),
        timeZone: Joi.string(),

        
        loggedUserID: Joi.string(),

        loggedDate: Joi.date(),
        isAvailable: Joi.boolean(),

        templateId: Joi.string(),
        isPublished: Joi.boolean()


    })

    let result = schema.validate(slotGroup)
    return result
}


function validateQuerySlotGroup(appointment) {
    let schema = Joi.object({

        date: Joi.date(),
        "countryId":Joi.string(),
        "countryName":Joi.string(),
        "cityId":Joi.string(),
        "cityName":Joi.string(),
        "medicalCenterId":Joi.string(),
        "medicalCenterName":Joi.string(),
        timeZone: Joi.date(),

        loggedUserID: Joi.string(),

        loggedDate: Joi.date(),
        isAvailable: Joi.boolean(),
        limit: Joi.string(),
        page: Joi.string(),
        sort: Joi.string(),

        templateId: Joi.string(),
        isPublished: Joi.boolean()


    })

    let result = schema.validate(appointment)
    // console.log(result);
    return result
}
function validationForFourWeekSlotGroup(Template) {
    let schema = Joi.object({
        fromDate: Joi.date().required(),
        medicalCenterId: Joi.string().required(),
    })
    let result = schema.validate(Template)

    return result
}

module.exports.validateSlotGroup = validateSlotGroup
module.exports.validateUpdateSlotGroup = validateUpdateSlotGroup
module.exports.validateQuerySlotGroup = validateQuerySlotGroup
module.exports.validationForFourWeekSlotGroup = validationForFourWeekSlotGroup


