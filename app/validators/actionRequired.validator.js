const Joi = require('@hapi/joi');

function validateAction(actionRequired) {
    let schema = Joi.object({

        actionName:Joi.string().required(),
        actionDiscription:Joi.string().required(),
            
    })

    let result = schema.validate(actionRequired)
    return result
}


function validateUpdateAction(actionRequired) {
    let schema = Joi.object({

        actionName:Joi.string(),
        actionDiscription:Joi.string(),
            
    })

    let result = schema.validate(actionRequired)
    return result
}

module.exports.validateAction = validateAction
module.exports.validateUpdateAction = validateUpdateAction
