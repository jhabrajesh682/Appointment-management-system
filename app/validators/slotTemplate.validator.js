const Joi = require("@hapi/joi");
let moment = require("moment");

function validateSlotTemplate(slotTemplate) {
  let slot = Joi.object().keys({
    starttime: Joi.string().required(),
    endtime: Joi.string().required(),
    serviceCategory: Joi.object().keys({
      reasonForAppointment: Joi.array().items(Joi.string()).required(),
      actionRequired: Joi.array().items(Joi.string()).required(),
    }),
    availableLimit: Joi.number().required(),
    consumedCount: Joi.number(),
    isAvailable: Joi.boolean(),
  });
  let schema = Joi.object({
    templateName: Joi.string().required(),
    timeZone: Joi.string().required(),
    country: Joi.object({
      countryId: Joi.string().required(),
      countryName: Joi.string().required(),
    }).required(),
    city: Joi.object({
      cityId: Joi.string().required(),
      cityName: Joi.string().required(),
    }).required(),
    medicalCenter: Joi.object({
      medicalCenterId: Joi.string().required(),
      medicalCenterName: Joi.string().required(),
    }).required(),

    timming: Joi.object({
      startTime: Joi.string().required(),
      interval: Joi.number().required(),
      break: Joi.object({
        starttime: Joi.string().required(),
        endtime: Joi.string().required(),
      }),
      endTime: Joi.string().required(),
    }).required(),

    loggedUserID: Joi.string().required(),
    weekend: Joi.array().items(Joi.string()).required(),
    loggedDate: Joi.date(),
  });

  let result = schema.validate(slotTemplate);
  // console.log(result);
  return result;
}

function validateUpdateSlotTemplate(slotTemplate) {
  let slot = Joi.object().keys({
    _id: Joi.string(),
    starttime: Joi.string(),
    endtime: Joi.string(),
    serviceCategory: Joi.object().keys({
      reasonForAppointment: Joi.array(),
      actionRequired: Joi.array(),
    }),
    availableLimit: Joi.number(),
    consumedCount: Joi.number(),
    isAvailable: Joi.boolean(),
  });
  let schema = Joi.object({
    templateName: Joi.string(),
    timeZone: Joi.string(),
    country: Joi.object({
      countryId: Joi.string(),
      countryName: Joi.string(),
    }),
    city: Joi.object({
      cityId: Joi.string(),
      cityName: Joi.string(),
    }),
    medicalCenter: Joi.object({
      medicalCenterId: Joi.string(),
      medicalCenterName: Joi.string(),
    }),
    slotCollection: Joi.object().keys({
      week1: Joi.object().keys({
        mondaySlot: Joi.array().items(slot),
        tuesdaySlot: Joi.array().items(slot),
        wednesdaySlot: Joi.array().items(slot),
        thursdaySlot: Joi.array().items(slot),
        fridaySlot: Joi.array().items(slot),
        saturdaySlot: Joi.array().items(slot),
        sundaySlot: Joi.array().items(slot),
      }),
      week2: Joi.object().keys({
        mondaySlot: Joi.array().items(slot),
        tuesdaySlot: Joi.array().items(slot),
        wednesdaySlot: Joi.array().items(slot),
        thursdaySlot: Joi.array().items(slot),
        fridaySlot: Joi.array().items(slot),
        saturdaySlot: Joi.array().items(slot),
        sundaySlot: Joi.array().items(slot),
      }),
      week3: Joi.object().keys({
        mondaySlot: Joi.array().items(slot),
        tuesdaySlot: Joi.array().items(slot),
        wednesdaySlot: Joi.array().items(slot),
        thursdaySlot: Joi.array().items(slot),
        fridaySlot: Joi.array().items(slot),
        saturdaySlot: Joi.array().items(slot),
        sundaySlot: Joi.array().items(slot),
      }),
      week4: Joi.object().keys({
        mondaySlot: Joi.array().items(slot),
        tuesdaySlot: Joi.array().items(slot),
        wednesdaySlot: Joi.array().items(slot),
        thursdaySlot: Joi.array().items(slot),
        fridaySlot: Joi.array().items(slot),
        saturdaySlot: Joi.array().items(slot),
        sundaySlot: Joi.array().items(slot),
      }),
    }),
    weekend: Joi.array().items(Joi.string()),
    loggedUserID: Joi.string(),
    loggedDate: Joi.date(),
  });
  let result = schema.validate(slotTemplate);
  return result;
}

function publishTempate(Template) {
  let schema = Joi.object({
    fromDate: Joi.string()
      .regex(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/)
      .required(),
    lastDate: Joi.string()
      .regex(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/)
      .required(),
    templateId: Joi.string().required(),
  });
  let result = schema.validate(Template);

  return result;
}

function validateSlotTemplateFromDate(slotTemplateDate) {
  let day = moment(slotTemplateDate).format("dddd");
  if (moment(slotTemplateDate).isValid() == false) {
    return {
      err: {
        message: "the given date is invalid",
      },
    };
  }
  if (day !== "Monday") {
    let mondayCount = 1;
    console.log(moment(slotTemplateDate).day());

    if (moment(slotTemplateDate).day() > 1) mondayCount = mondayCount + 7;
    console.log(mondayCount);

    let monday = moment(slotTemplateDate).day(mondayCount).format("YYYY-MM-DD");

    return {
      err: {
        message: "the given date is not Monday",
        expectedDate: `expected Date for Monday : ${monday}`,
      },
    };
  }
  return true;
}

function copyPreviousDayValidate(Template) {
  let schema = Joi.object({
    currentDay: Joi.object({
      weekno: Joi.string().required(),
      slotname: Joi.string().required()
    }).required(),
    previousDay: Joi.object({
      weekno: Joi.string().required(),
      slotname: Joi.string().required()
    }).required()
  })
  let result = schema.validate(Template);
  return result;
}
function copyPreviousWeekValidate(Template) {
  let schema = Joi.object({
    currentWeekno: Joi.string().required(),

    previousWeekno: Joi.string().required(),

  })
  let result = schema.validate(Template);
  return result;
}

module.exports.validateSlotTemplate = validateSlotTemplate;
module.exports.validateUpdateSlotTemplate = validateUpdateSlotTemplate;
module.exports.validateSlotTemplateFromDate = validateSlotTemplateFromDate;
module.exports.publishTempate = publishTempate;
module.exports.copyPreviousDayValidate = copyPreviousDayValidate;
module.exports.copyPreviousWeekValidate = copyPreviousWeekValidate;

// console.log(validateSlotTemplateFromDate('2020-07-20'));
