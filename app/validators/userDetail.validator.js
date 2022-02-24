const Joi = require("@hapi/joi");

function validateUserDetail(detail) {
  let schema = Joi.object({
    reason: Joi.array().required(),
    actions: Joi.array().required(),
    qvcCode: Joi.string().required(),
    contact: Joi.string().required(),

  });

  let result = schema.validate(detail);
  // console.log(result);
  return result;
}

function validateUserDetailWithoutOtp(detail) {
  let schema = Joi.object({
    reason: Joi.array().required(),
    actions: Joi.array().required(),
    qvcCode: Joi.string().required()

  });

  let result = schema.validate(detail);
  // console.log(result);
  return result;
}

function validateApplicantData(detail) {
  let schema = Joi.object({
    visa_no: Joi.number().required(),
    passport_no: Joi.string().allow('').required(),
    dob: Joi.string().required(),
  });

  let result = schema.validate(detail);
  // console.log(result);
  return result;
}

module.exports.validateUserDetail = validateUserDetail;
module.exports.validateApplicantData = validateApplicantData;
module.exports.validateUserDetailWithoutOtp = validateUserDetailWithoutOtp;
