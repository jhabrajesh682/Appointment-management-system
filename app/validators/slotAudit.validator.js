const Joi = require('@hapi/joi');

function validateQuerySlotAudit(slotAudit) {
    let schema = Joi.object({

        date: Joi.date(),
        starttime: Joi.string(),
        endtime: Joi.date(),

        reasonForAppointment: Joi.string(),
        actionRequired: Joi.string(),        
        availableLimit: Joi.number(),

        consumedCount: Joi.number(),
        isAvailable: Joi.boolean(),
        slotGroup: Joi.string(),
        
        templateId: Joi.string(),
        slotCreated:Joi.string(),
        slotUpdated:Joi.string(),

    
    })

    let result = schema.validate(slotAudit)
    return result
}

module.exports.validateQuerySlotAudit = validateQuerySlotAudit
