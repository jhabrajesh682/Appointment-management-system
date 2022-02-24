const Joi = require("@hapi/joi");

function validateReasonAndActionMapping(mapping) {
  let schema = Joi.object({
    reason: Joi.array().items(Joi.string()).required(),
    action: Joi.array().items(Joi.string()),
  });

  let result = schema.validate(mapping);
  // console.log(result);
  return result;
}

function validateUpdateReasonAndActionMapping(mapping) {
  let schema = Joi.object({
    reason: Joi.array().items(Joi.string()),
    action: Joi.array().items(Joi.string()),
  });

  let result = schema.validate(mapping);
  // console.log(result);
  return result;
}

module.exports.validateReasonAndActionMapping = validateReasonAndActionMapping;
module.exports.validateUpdateReasonAndActionMapping = validateUpdateReasonAndActionMapping;
