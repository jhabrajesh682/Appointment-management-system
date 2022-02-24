const NoReferralError = require('../models/appointment/NoReferralError')
const validate = require('../validators/noReferralError.validator')

class Error {
    /**
       * @function - Get all the registered users from the db
       *
       * @param - Express.req , Express.res
       *
       * @returns - List of registered users
       */

    async createNoReferralError(req, res) {
        // throw new Error("could not create a user")
        // console.log(" in the controller");

        let { error } = validate.validateNoReferralError(req.body)
        if (error) {
            return res.status(400).send({
                message: "failed",
                result: error
            })
        }

        let noReferralError = new NoReferralError({
            country: req.body.country,
            city: req.body.city,
            medicalCenter: req.body.medicalCenter,
            body: req.body.body,
            htmlBody: req.body.htmlBody,
            operation: req.body.operation
        })

        await noReferralError.save()

        return res.status(200).send({
            message: "Error Created",
            result: noReferralError
        });
    }

    async getAllNoReferralError(req, res) {

        let limit
        let page
        if (req.query.limit) {
            limit = (parseInt(req.query.limit) ? parseInt(req.query.limit) : 10);
            page = req.query.page ? (parseInt(req.query.page) ? parseInt(req.query.page) : 1) : 1;
        }

        const createdAt = req.query.sort ? (req.query.sort == 'desc' ? -1 : 1) : 1

        const noReferralError = await NoReferralError.find({}).limit(limit).skip((page - 1) * limit).sort({ createdAt: createdAt }).lean()

        res.status(200).send({
            status: true,
            noReferralError: noReferralError,
        });
    }

    async getOneNoReferralError(req, res) {
        let emailId = req.params.id;
        let noReferralError = await NoReferralError.findById(emailId).lean()
        if (!noReferralError) {
            return res.status(404).send({ message: "noReferralError  doesnt exist" })
        }

        res.status(200).send({
            status: true,
            noReferralError: noReferralError,
        });

    }

    async getOneNoReferralErrorAndRemove(req, res) {
        let emailId = req.params.id;
        let noReferralError = await NoReferralError.findByIdAndRemove(emailId)
        let status = false
        if (noReferralError) {
            status = true
        }
        res.status(200).send({
            status: status,
            noReferralError: noReferralError,
        });

    }

    async getOneNoReferralErrorAndUpdate(req, res) {
        let emailId = req.params.id;
        let noReferralError = await NoReferralError.findById(emailId)
        if (!noReferralError) {
            return res.status(404).send({ message: "noReferralError doesnt exist" })
        }

        let { error } = validate.validateUpdateNoReferralError(req.body)
        if (error) {
            return res.status(400).send({
                message: "failed",
                result: error
            })
        }

        noReferralError.set(req.body)

        await noReferralError.save()

        res.status(200).send({
            status: true,
            noReferralError: noReferralError,
        });

    }




}

module.exports = Error;