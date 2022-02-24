const Joi = require("@hapi/joi");

function validateSlot(slot) {
  let schema = Joi.object({
    date: Joi.date().required(),
    starttime: Joi.string().required(),
    endtime: Joi.string().required(),

    reasonForAppointment: Joi.string().required(),
    actionRequired: Joi.array().items(Joi.string()),

    availableLimit: Joi.number().required(),
    slotGroup: Joi.string().required(),
    templateId: Joi.string().required(),
  });

  let result = schema.validate(slot);
  // console.log(result);
  return result;
}

function validateUpdateSlot(slot) {
  let schema = Joi.object({
    date: Joi.date(),
    starttime: Joi.string(),
    endtime: Joi.string(),
    serviceCategory: Joi.object().keys({
      reasonForAppointment: Joi.string(),
      actionRequired: Joi.array().items(Joi.string()),
    }),
    availableLimit: Joi.number(),
    consumedCount: Joi.number(),
    isAvailable: Joi.boolean(),
    slotGroup: Joi.string(),
    templateId: Joi.string(),
  });

  let result = schema.validate(slot);
  return result;
}

function validateUserDetails(slot) {
  let schema = Joi.object({
    reasonForAppointment: Joi.string(),
    actionRequired: Joi.array().items(Joi.string()),
    slotGroup: Joi.string(),
    isMultiple: Joi.boolean().required(),
  });

  let result = schema.validate(slot);
  return result;
}

function validateQuerySolt(appointment) {
  let schema = Joi.object({
    date: Joi.date(),
    starttime: Joi.string(),
    endtime: Joi.string(),

    reasonForAppointment: Joi.string(),
    actionRequired: Joi.string(),

    availableLimit: Joi.number(),
    consumedCount: Joi.number(),
    isAvailable: Joi.boolean(),
    slotGroup: Joi.string(),
    limit: Joi.number(),
    page: Joi.number(),
    sort: Joi.string().allow("asc,desc"),

    templateId: Joi.string(),
  });

  let result = schema.validate(appointment);
  // console.log(result);
  return result;
}

function validateBySlotGroup(slot) {
  let schema = Joi.object({
    slotGroup: Joi.string().required(),
  });

  let result = schema.validate(slot);
  return result;
}

module.exports.validateSlot = validateSlot;
module.exports.validateUpdateSlot = validateUpdateSlot;
module.exports.validateQuerySolt = validateQuerySolt;
module.exports.validateUserDetails = validateUserDetails;
module.exports.validateBySlotGroup = validateBySlotGroup;
