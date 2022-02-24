const moment = require('moment')
const Appointments = require("../models/appointment/Appointment");
const EmailController = require('../controllers/email.controller');

const emailcontroller = new EmailController()

// timezone='America/Los_Angeles' example
module.exports = emailService = (timezone) => {
    console.log('BookingAndRescheduleMail----->');

    let CronJob = require('cron').CronJob;
    let job = new CronJob('0 0 0 * * *', async function () {

        console.log("email service started and the time zone is " + timezone);
        let today = moment(new Date())
        let tommorow = moment(today).add(1, 'days')

        let appointments = await Appointments.find({ appointmentDate: { $gte: today, $lte: tommorow } });
        console.log(appointments, "appointment");

        for (const appointment of appointments) {
            emailcontroller.BookingAndRescheduleMail(appointment._id, "appointment reminder");
            console.log('BookingAndRescheduleMail--------->');
        }

    }, null, true, timezone);
    job.start();

}

module.exports = smsService = function (timezone) {

    let CronJob = require('cron').CronJob;
    let job = new CronJob('0 0 0 * * *', async function () {

        let today = moment(new Date())
        let tommorow = moment(today).add(1, 'days')

        let appointments = await Appointments.find({})
    }, null, true, timezone);
    job.start();

}
// module.exports={
//     emailService : this.emailService
//  };

