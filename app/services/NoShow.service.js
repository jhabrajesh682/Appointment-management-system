const moment = require('moment')
const momentTz = require('moment-timezone')
const Appointments = require("../models/appointment/Appointment");
const MedicalCenterModal = require("../models/master/MedicalCenter");
const AppointmentAudits = require("../models/appointment/AppointmentAudit");
const EmailController = require('../controllers/email.controller');
const TmsUrl = process.env.TMS_LINK + process.env.TMS_V1;
const axios = require('axios')
const EmailTemplate = require('../controllers/email.controller')
let email = new EmailTemplate()
const SmsTemplate = require('../controllers/smsTemplate.controller')
let sms = new SmsTemplate()


const emailcontroller = new EmailController()

// timezone='America/Los_Angeles' example
module.exports = noShow = () => {
    console.log('noShow Service ----->');

    let CronJob = require('cron').CronJob;
    let job = new CronJob('0 0 0 * * *', async function () {


        let medicalCenters = await MedicalCenterModal.find({})
            .populate("addressDetails.countryId")
            .populate("addressDetails.cityId")
            .populate("businessId")
            .populate("stations")
            .populate("stations")
            .lean()
        medicalCenters = medicalCenters.map(x => {
            console.log(x);
            x.timezone = x.addressDetails.cityId.timeZoneName
            delete x.stations
            delete x.businessId
            delete x.addressDetails
            delete x.customercare
            delete x.updatedAt
            delete x.createdAt
            return x
        })
        // console.log(medicalCenters, "medicalcenterId🔥 ");

        // console.log("email service started and the time zone is " + timezone);
        let tommorow = moment().add(1, 'days')

        let appointments = await Appointments.find({ appointmentDate: { $lte: tommorow } }).populate('slotId');
        // console.log(appointments, "appointment");

        for (const appointment of appointments) {

            // console.log(appointment);
            let { timezone } = medicalCenters.find(x => x._id == appointment.medicalCenter.medicalCenterId)
            // console.log(timezone);
            if (timezone) {
                let date = momentTz(appointment.appointmentDate).tz(timezone)
                let today = momentTz().tz(timezone)

                if (date.isBefore(today)) {
                    console.log("appointment missed");
                    await appointment.set({ status: "absent" });
                    await appointment.save();

                    let appointmentAudit = new AppointmentAudits({
                        visa_ref_no: appointment.visa_ref_no,
                        passport_no: appointment.passport_no,
                        fullName: appointment.fullName,
                        gender: appointment.gender,
                        date_of_birth: appointment.date_of_birth,
                        appointmentDate: appointment.appointmentDate,
                        country: appointment.country,
                        city: appointment.city,
                        medicalCenter: appointment.medicalCenter,
                        appt_reason: appointment.appt_reason,
                        actionRequired: appointment.actionRequired,
                        referralDetails: appointment.referralDetails,
                        appointmentId: appointment._id,
                        slotId: appointment.slotId._id,
                        status: appointment.status,
                        appointmentCreated: appointment.createdAt,
                        appointmentUpdated: appointment.updatedAt,
                        phone: appointment.phone,
                        email: appointment.email


                    });

                    // let appoint = appointment
                    let appoint = {
                        email: appointment.email,
                        city: appointment.city,
                        slotId: appointment.slotId,
                        medicalCenter: appointment.medicalCenter,
                        fullName: appointment.fullName,
                        phone: appointment.phone,

                    }
                    console.log(appoint);
                    email.CancelAndMissedMail(appoint, "appointment missed")
                        .then(x => { console.log("email mail sent") })
                        .catch(err => {
                            console.log("email not sent ");
                            console.error(err);
                        });

                    sms.CancelAndMissedSms(appoint, "appointment missed")
                        .then(x => { console.log("sms mail sent") })
                        .catch(err => {
                            console.log("sms not sent ");
                            console.error(err);
                        });

                    await appointmentAudit.save();
                    appointment.remove();
                }
            }
        }

    }, null, true, 'Asia/Kolkata');
    job.start();

}


