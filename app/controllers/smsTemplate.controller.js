const SmsTemplate = require('../models/appointment/SmsTemplate')
const Appointment = require('../models/appointment/Appointment')
const moment = require('moment')

const validate = require('../validators/smstemplate.validator')
const sendSms = require('../helpers/sms')


class Sms {
    /**
       * @function - Get all the registered users from the db
       *
       * @param - Express.req , Express.res
       *
       * @returns - List of registered users
       */

    async createSmsTemplate(req, res) {
        // throw new Error("could not create a user")
        // console.log(" in the controller");

        let { error } = validate.validateSmsTemplate(req.body)
        if (error) {
            return res.status(400).send({
                message: "failed",
                result: error
            })
        }

        let smsTemplate = new SmsTemplate({
            country: req.body.country,
            city: req.body.city,
            medicalCenter: req.body.medicalCenter,
            body: req.body.body,
            type: req.body.type,
            htmlBody: req.body.htmlBody,
            operation: req.body.operation
        })

        await smsTemplate.save()

        return res.status(200).send({
            message: "Sms Created",
            result: smsTemplate
        });
    }

    async getAllSmsTemplate(req, res) {

        let limit
        let page
        if (req.query.limit) {
            limit = (parseInt(req.query.limit) ? parseInt(req.query.limit) : 10);
            page = req.query.page ? (parseInt(req.query.page) ? parseInt(req.query.page) : 1) : 1;
        }

        const createdAt = req.query.sort ? (req.query.sort == 'desc' ? -1 : 1) : 1

        const smsTemplate = await SmsTemplate.find({}).limit(limit).skip((page - 1) * limit).sort({ createdAt: createdAt }).lean()

        res.status(200).send({
            status: true,
            smsTemplate: smsTemplate,
        });
    }

    async getOneSmsTemplate(req, res) {
        let smsId = req.params.id;
        let smsTemplate = await SmsTemplate.findById(smsId).lean()
        if (!smsTemplate) {
            return res.status(404).send({ message: "smsTemplate  doesnt exist" })
        }

        res.status(200).send({
            status: true,
            smsTemplate: smsTemplate,
        });

    }

    async getOneSmsTemplateAndRemove(req, res) {
        let smsId = req.params.id;
        let smsTemplate = await SmsTemplate.findByIdAndRemove(smsId)
        let status = false
        if (smsTemplate) {
            status = true
        }
        res.status(200).send({
            status: status,
            smsTemplate: smsTemplate,
        });

    }

    async getOneSmsTemplateAndUpdate(req, res) {
        let smsId = req.params.id;
        let smsTemplate = await SmsTemplate.findById(smsId)
        if (!smsTemplate) {
            return res.status(404).send({ message: "smsTemplate doesnt exist" })
        }

        let { error } = validate.validateUpdateSmsTemplate(req.body)
        if (error) {
            return res.status(400).send({
                message: "failed",
                result: error
            })
        }

        smsTemplate.set(req.body)

        await smsTemplate.save()

        res.status(200).send({
            status: true,
            smsTemplate: smsTemplate,
        });

    }

    async sendSms(data, medicalCenter, type) {

        let phoneNo = data.phoneNo
        let locationPlaceholder = data.location
        let appointmenttimePlaceholder = data.appointmenttime
        let customercarecontactPlaceholder = data.customercarecontact
        let customernamePlaceholder = data.customername
        let labaddressPlaceholder = data.labaddress

        let smsTemplate = await SmsTemplate.findOne({ "medicalCenter.medicalCenterId": medicalCenter, type: type })
        if (!smsTemplate) {
            throw new Error("SMS Template not found for the given medical center and type")
        }
        let body = smsTemplate.body



        body = body.replace('%location%', locationPlaceholder);
        body = body.replace('%appointmenttime%', appointmenttimePlaceholder);
        body = body.replace("%customercarecontact%", customercarecontactPlaceholder);
        body = body.replace('%customername%', customernamePlaceholder);
        body = body.replace('%labaddress%', labaddressPlaceholder);

        // sendSms({ sms: sms, subject: subject, body: body })  something like hlper function

    }

    async BookingAndRescheduleSms(appointmentId, type) {

        console.log("sms enter con");

        let types = ['appointment confirmation', 'appointment rescheduled', 'appointment reminder']
        if (!types.includes(type)) {
            throw new Error("Invalid Type")
        }
        let appointment = await Appointment.findById(appointmentId).populate('slotId').lean()

        let sms = appointment.phone
        let locationPlaceholder = appointment.city.cityName
        let appointmenttimePlaceholder = `${appointment.slotId.starttime} on ${moment(appointment.slotId.date).format('MMMM Do YYYY')}`
        let customercarecontactPlaceholder = appointment.medicalCenter.customerCare.join(",")
        let customernamePlaceholder = appointment.fullName
        let labaddressPlaceholder = `${appointment.medicalCenter.medicalCenterAddress}, ${appointment.medicalCenter.zipCode}`

        let smsTemplate = await SmsTemplate.findOne({ "medicalCenter.medicalCenterId": appointment.medicalCenter.medicalCenterId, type: type })
        if (!smsTemplate) {
            console.log("Sms Template not found for the given medical center and type");

            throw new Error("Sms Template not found for the given medical center and type")
        }
        let subject = smsTemplate.subject
        let body = smsTemplate.body

        body = body.replace('%location%', locationPlaceholder);
        body = body.replace('%appointmenttime%', appointmenttimePlaceholder);
        body = body.replace("%customercarecontact%", customercarecontactPlaceholder);
        body = body.replace('%customername%', customernamePlaceholder);
        body = body.replace('%labaddress%', labaddressPlaceholder);

        sendSms({ number: sms, body: body })

    }

    async CancelAndMissedSms(appointment, type) {
        console.log("sms enter con");

        let types = ["appointment missed", "appointment cancellation"]
        if (!types.includes(type)) {
            throw new Error("Invalid Type")
        }
        let sms = appointment.phone
        let locationPlaceholder = appointment.city.cityName
        let appointmenttimePlaceholder = `${appointment.slotId.starttime} on ${moment(appointment.slotId.date).format('MMMM Do YYYY')}`
        let customercarecontactPlaceholder = appointment.medicalCenter.customerCare.join(",")
        let customernamePlaceholder = appointment.fullName
        let labaddressPlaceholder = `${appointment.medicalCenter.medicalCenterAddress}, ${appointment.medicalCenter.zipCode}`

        console.log(appointmenttimePlaceholder);

        let smsTemplate = await SmsTemplate.findOne({ "medicalCenter.medicalCenterId": appointment.medicalCenter.medicalCenterId, type: type })
        if (!smsTemplate) {
            console.log("Sms Template not found for the given medical center and type");
            throw new Error("Sms Template not found for the given medical center and type")
        }
        let subject = smsTemplate.subject
        let body = smsTemplate.body



        body = body.replace('%location%', locationPlaceholder);
        body = body.replace('%appointmenttime%', appointmenttimePlaceholder);
        body = body.replace("%customercarecontact%", customercarecontactPlaceholder);
        body = body.replace('%customername%', customernamePlaceholder);
        body = body.replace('%labaddress%', labaddressPlaceholder);

        console.log(body);

        sendSms({ number: sms, body: body })


    }
}

module.exports = Sms;