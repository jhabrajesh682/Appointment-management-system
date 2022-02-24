const Joi = require('@hapi/joi');

function validateReason(reasonRequired) {
    let schema = Joi.object({

        reasonName:Joi.string().required(),
        reasonDiscription:Joi.string().required(),
            
    })

    let result = schema.validate(reasonRequired)
    return result
}


function validateUpdateReason(reasonRequired) {
    let schema = Joi.object({

        reasonName:Joi.string(),
        reasonDiscription:Joi.string(),
            
    })

    let result = schema.validate(reasonRequired)
    return result
}

module.exports.validateReason = validateReason
module.exports.validateUpdateReason = validateUpdateReason
