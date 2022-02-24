const EmailTemplate = require('../models/appointment/emailMaster')
const Appointment = require('../models/appointment/Appointment')
const moment = require('moment')

const validate = require('../validators/email.validator')
const sendEmail = require('../helpers/email')

class Email {
    /**
       * @function - Get all the registered users from the db
       *
       * @param - Express.req , Express.res
       *
       * @returns - List of registered users
       */

    async createEmailTemplate(req, res) {
        // throw new Error("could not create a user")
        // console.log(" in the controller");

        let { error } = validate.validateEmailTemplate(req.body)
        if (error) {
            return res.status(400).send({
                message: "failed",
                result: error
            })
        }

        let emailTemplate = new EmailTemplate({
            country: req.body.country,
            city: req.body.city,
            medicalCenter: req.body.medicalCenter,
            subject: req.body.subject,
            body: req.body.body,
            type: req.body.type,
            htmlBody: req.body.htmlBody,
            operation: req.body.operation
        })

        await emailTemplate.save()

        return res.status(200).send({
            message: "Email Created",
            result: emailTemplate
        });
    }

    async getAllEmailTemplate(req, res) {

        let limit
        let page
        if (req.query.limit) {
            limit = (parseInt(req.query.limit) ? parseInt(req.query.limit) : 10);
            page = req.query.page ? (parseInt(req.query.page) ? parseInt(req.query.page) : 1) : 1;
        }

        const createdAt = req.query.sort ? (req.query.sort == 'desc' ? -1 : 1) : 1

        const emailTemplate = await EmailTemplate.find({}).limit(limit).skip((page - 1) * limit).sort({ createdAt: createdAt }).lean()

        res.status(200).send({
            status: true,
            emailTemplate: emailTemplate,
        });
    }

    async getOneEmailTemplate(req, res) {
        let emailId = req.params.id;
        let emailTemplate = await EmailTemplate.findById(emailId).lean()
        if (!emailTemplate) {
            return res.status(404).send({ message: "emailTemplate  doesnt exist" })
        }

        res.status(200).send({
            status: true,
            emailTemplate: emailTemplate,
        });

    }

    async getOneEmailTemplateAndRemove(req, res) {
        let emailId = req.params.id;
        let emailTemplate = await EmailTemplate.findByIdAndRemove(emailId)
        let status = false
        if (emailTemplate) {
            status = true
        }
        res.status(200).send({
            status: status,
            emailTemplate: emailTemplate,
        });

    }

    async getOneEmailTemplateAndUpdate(req, res) {
        let emailId = req.params.id;
        let emailTemplate = await EmailTemplate.findById(emailId)
        if (!emailTemplate) {
            return res.status(404).send({ message: "emailTemplate doesnt exist" })
        }

        let { error } = validate.validateUpdateEmailTemplate(req.body)
        if (error) {
            return res.status(400).send({
                message: "failed",
                result: error
            })
        }

        emailTemplate.set(req.body)

        await emailTemplate.save()

        res.status(200).send({
            status: true,
            emailTemplate: emailTemplate,
        });

    }

    async BookingAndRescheduleMail(appointmentId, type) {

        let types = ['appointment confirmation', 'appointment rescheduled', 'appointment reminder']
        if (!types.includes(type)) {
            throw new Error("Invalid Type")
        }
        let appointment = await Appointment.findById(appointmentId).populate('slotId').lean()

        let email = appointment.email
        let locationPlaceholder = appointment.city.cityName
        let appointmenttimePlaceholder = `${appointment.slotId.starttime} on ${moment(appointment.slotId.date).format('MMMM Do YYYY')}`
        let customercarecontactPlaceholder = appointment.medicalCenter.customerCare.join(",")
        let customernamePlaceholder = appointment.fullName
        let labaddressPlaceholder = `${appointment.medicalCenter.medicalCenterAddress}, ${appointment.medicalCenter.zipCode}`

        let emailTemplate = await EmailTemplate.findOne({ "medicalCenter.medicalCenterId": appointment.medicalCenter.medicalCenterId, type: type })
        if (!emailTemplate) {
            console.log("Email Template not found for the given medical center and type");

            throw new Error("Email Template not found for the given medical center and type")
        }
        let subject = emailTemplate.subject
        let body = emailTemplate.htmlBody

        subject = subject.replace('%location%', locationPlaceholder);
        subject = subject.replace('%appointmenttime%', appointmenttimePlaceholder);
        subject = subject.replace("%customercarecontact%", customercarecontactPlaceholder);
        subject = subject.replace('%customername%', customernamePlaceholder);
        subject = subject.replace('%labaddress%', labaddressPlaceholder);

        body = body.replace('%location%', locationPlaceholder);
        body = body.replace('%appointmenttime%', appointmenttimePlaceholder);
        body = body.replace("%customercarecontact%", customercarecontactPlaceholder);
        body = body.replace('%customername%', customernamePlaceholder);
        body = body.replace('%labaddress%', labaddressPlaceholder);

        sendEmail({ email: email, subject: subject, body: body })

    }

    async CancelAndMissedMail(appointment, type) {

        let types = ["appointment missed", "appointment cancellation"]
        if (!types.includes(type)) {
            throw new Error("Invalid Type")
        }
        let email = appointment.email
        let locationPlaceholder = appointment.city.cityName
        let appointmenttimePlaceholder = `${appointment.slotId.starttime} on ${moment(appointment.slotId.date).format('MMMM Do YYYY')}`
        let customercarecontactPlaceholder = appointment.medicalCenter.customerCare.join(",")
        let customernamePlaceholder = appointment.fullName
        let labaddressPlaceholder = `${appointment.medicalCenter.medicalCenterAddress}, ${appointment.medicalCenter.zipCode}`

        console.log(appointmenttimePlaceholder);

        let emailTemplate = await EmailTemplate.findOne({ "medicalCenter.medicalCenterId": appointment.medicalCenter.medicalCenterId, type: type })
        if (!emailTemplate) {
            console.log("Email Template not found for the given medical center and type");
            throw new Error("Email Template not found for the given medical center and type")
        }
        let subject = emailTemplate.subject
        let body = emailTemplate.htmlBody

        subject = subject.replace('%location%', locationPlaceholder);
        subject = subject.replace('%appointmenttime%', appointmenttimePlaceholder);
        subject = subject.replace("%customercarecontact%", customercarecontactPlaceholder);
        subject = subject.replace('%customername%', customernamePlaceholder);
        subject = subject.replace('%labaddress%', labaddressPlaceholder);

        body = body.replace('%location%', locationPlaceholder);
        body = body.replace('%appointmenttime%', appointmenttimePlaceholder);
        body = body.replace("%customercarecontact%", customercarecontactPlaceholder);
        body = body.replace('%customername%', customernamePlaceholder);
        body = body.replace('%labaddress%', labaddressPlaceholder);

        sendEmail({ email: email, subject: subject, body: body })

    }


}

module.exports = Email;