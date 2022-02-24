const Joi = require("@hapi/joi");

function validateAppointment(appointment) {
  let referralDetail = Joi.object().keys({
    Referralid: Joi.number().required(),
    Referral: Joi.string().required(),
    ReferralAction: Joi.array().required(),

    Nextactiondate: Joi.date().required(),
  });
  let schema = Joi.object({
    visa_ref_no: Joi.string().required(),
    passport_no: Joi.string().required(),
    gender: Joi.string().required(),
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    date_of_birth: Joi.date().required(),
    callCenter: Joi.boolean().required(),
    appointmentDate: Joi.date().required(),
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
      medicalCenterAddress: Joi.string().required(),
      zipCode: Joi.string().required(),
      customerCare: Joi.array().items(Joi.string()).required(),
    }).required(),
    appt_reason: Joi.string().required(),
    actionRequired: Joi.array().required(),
    slotId: Joi.string().required(),
    user_login_status: Joi.string(),
    status: Joi.string(),
    referralDetails: Joi.array().items(referralDetail),
    callCenter: Joi.boolean()
  });

  let result = schema.validate(appointment);
  // console.log(result);
  return result;
}

function validateUpdateAppointment(appointment) {
  let referralDetail = Joi.object().keys({
    Referralid: Joi.number(),
    Referral: Joi.string(),
    ReferralAction: Joi.array(),
    NextActionDate: Joi.date(),
  });
  let schema = Joi.object({
    visa_ref_no: Joi.string(),
    passport_no: Joi.string(),
    gender: Joi.string(),

    fullName: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),
    date_of_birth: Joi.date(),
    appointmentDate: Joi.date(),
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
      medicalCenterAddress: Joi.string(),
      zipCode: Joi.string(),
      customerCare: Joi.array().items(Joi.string()),
    }),
    appt_reason: Joi.string(),
    actionRequired: Joi.string(),
    slotId: Joi.string(),
    user_login_status: Joi.string(),
    referralDetails: Joi.array().items(referralDetail),
    callCenter: Joi.boolean()

  });

  let result = schema.validate(appointment);
  // console.log(result);
  return result;
}

function validateQueryAppointment(appointment) {
  let schema = Joi.object({
    visa_ref_no: Joi.string(),
    passport_no: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
    date_of_birth: Joi.date(),
    appointmentDate: Joi.date(),
    countryId: Joi.string(),
    countryName: Joi.string(),
    cityId: Joi.string(),
    cityName: Joi.string(),
    medicalCenterId: Joi.string(),
    medicalCenterName: Joi.string(),
    appt_reason: Joi.string(),
    actionRequired: Joi.string(),
    slotId: Joi.string(),
    user_login_status: Joi.string(),
    status: Joi.string(),
    limit: Joi.string(),
    page: Joi.string(),
    sort: Joi.string(),
  });

  let result = schema.validate(appointment);
  // console.log(result);
  return result;
}

function validateAppointmentHistory(appointment) {
  let schema = Joi.object({
    visa_ref_no: Joi.string().required(),
    passport_no: Joi.string().required(),
    date_of_birth: Joi.date().required(),
  });

  let result = schema.validate(appointment);
  // console.log(result);
  return result;
}

module.exports.validateAppointment = validateAppointment;
module.exports.validateUpdateAppointment = validateUpdateAppointment;
module.exports.validateQueryAppointment = validateQueryAppointment;
module.exports.validateAppointmentHistory = validateAppointmentHistory;
