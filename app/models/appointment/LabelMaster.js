const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const labelSchema = new Schema({

    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Country,
        required: true
    },

    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: City,
        required: true
    },

    language: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    appointment_login: {
        type: String,
        required: true
    },
    visa_no: {
        type: String,
        required: true
    },
    passport_no: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    recaptcha: {
        type: String,
        required: true
    },
    submit: {
        type: String,
        required: true
    },
    screen2_applicant_detail: {
        type: String,
        required: true
    },
    screen2_appicant_name: {
        type: String,
        required: true
    },
    screen2_visa_reference: {
        type: String,
        required: true
    },
    screen2_passport_number: {
        type: String,
        required: true
    },
    screen2_dob: {
        type: String,
        required: true
    },
    screen2_visa_type: {
        type: String,
        required: true
    },
    screen2_appointmentbooking: {
        type: String,
        required: true
    },
    screen2_appointment_history: {
        type: String,
        required: true
    },
    screen2_reason_for_appointmenton: {
        type: String,
        required: true
    },
    screen2_book_appointment: {
        type: String,
        required: true
    },
    screen2_date_of_booking: {
        type: String,
        required: true
    },
    screen2_action_required: {
        type: String,
        required: true
    },
    screen2_appointment_date: {
        type: String,
        required: true
    },
    screen2_appointment_time: {
        type: String,
        required: true
    },
    screen2_status: {
        type: String,
        required: true
    },
    screen2_please_select_an_available_slot: {
        type: String,
        required: true
    },
    screen2_morning: {
        type: String,
        required: true
    },
    screen2_afternoon: {
        type: String,
        required: true
    },
    screen2_evening: {
        type: String,
        required: true
    },
    screen2_available: {
        type: String,
        required: true
    },
    screen2_not_available: {
        type: String,
        required: true
    },
    are_you_sure: {
        type: String,
        required: true
    },
    cancel_message: {
        type: String,
        required: true
    },
    do_not_cancel: {
        type: String,
        required: true
    },
    confirrm: {
        type: String,
        required: true
    },
    close: {
        type: String,
        required: true
    },
    appointment_cancelled: {
        type: String,
        required: true
    },
    cancel_Appointment: {
        type: String,
        required: true
    },
    reschedule_appointment: {
        type: String,
        required: true
    },
    appointment_letter: {
        type: String,
        required: true
    },

    pls_select_your_date_of_Birth_placeholder: {
        type: String,
        required: true
    },
    //OTP Modal labels
    otp_verification: {
        type: String,
        required: true
    },
    Pls_Enter_otp: {
        type: String,
        required: true
    },
    Enter_otp_placeholder: {
        type: String,
        required: true
    },
    cancel_Button_otp: {
        type: String,
        required: true
    },
    submit_Button_otp: {
        type: String,
        required: true
    },

    retry_Button_otp: {
        type: String,
        required: true
    },

    otp_retry_message: {
        type: String,
        required: true
    },

    // Reschedule modal cancel Error MSG

    unable_to_reschedule_the_appointment: {
        type: String,
        required: true
    },

    reschedule_Error_Msg: {
        type: String,
        required: true
    },

    //invalid credential Error Msg

    oopsinvalidCredentials: {
        type: String,
        required: true
    },

    invalidCredentialsErrorMsg: {
        type: String,
        required: true
    }

}, {
    timestamps: true
})

module.exports = ActionRequired = mongoose.model('Label', labelSchema)