const Joi = require('@hapi/joi');

function validateQueryAppointmentAudit(appointmentAudit) {
    let schema = Joi.object({

        visa_ref_no:Joi.string(),
        passport_no:Joi.string(),
        date_of_birth:Joi.date(),
        appointmentDate:Joi.date(),
        "countryId":Joi.string(),
        "countryName":Joi.string(),
        "cityId":Joi.string(),
        "cityName":Joi.string(),
        "medicalCenterId":Joi.string(),
        "medicalCenterName":Joi.string(),
        appointmentId:Joi.string(),
        appt_reason:Joi.string(),
        actionRequired:Joi.string(),
        slotId:Joi.string(),
        user_login_status:Joi.string(),
        status:Joi.string(),
        limit:Joi.string(),
        page:Joi.string(),
        sort:Joi.string(),
        appointmentCreated:Joi.string(),
        appointmentUpdated:Joi.string(),

    
    })

    let result = schema.validate(appointmentAudit)
    return result
}

module.exports.validateQueryAppointmentAudit = validateQueryAppointmentAudit
