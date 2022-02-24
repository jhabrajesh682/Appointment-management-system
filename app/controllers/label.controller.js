const LabelModal = require('../models/appointment/LabelMaster')
const validate = require('../validators/label.validator')

class Label {
    /**
       * @function - Get all the registered users from the db
       *
       * @param - Express.req , Express.res
       *
       * @returns - List of registered users
       */

    async createLabel(req, res) {
        // throw new Error("could not create a user")
        // console.log(" in the controller");

        let { error } = validate.validateLable(req.body)
        if (error) {
            return res.status(400).send({
                message: "failed",
                result: error
            })
        }

        let lable = new LabelModal({
            ...req.body
        })

        await lable.save()

        return res.status(200).send({
            message: "Label Created",
            result: lable
        });
    }

    async getAllLabel(req, res) {

        let limit
        let page
        if (req.query.limit) {
            limit = (parseInt(req.query.limit) ? parseInt(req.query.limit) : 10);
            page = req.query.page ? (parseInt(req.query.page) ? parseInt(req.query.page) : 1) : 1;
        }

        const createdAt = req.query.sort ? (req.query.sort == 'desc' ? -1 : 1) : 1

        const lable = await LabelModal.find({}).populate("country").populate("city").limit(limit).skip((page - 1) * limit).sort({ createdAt: createdAt }).lean()

        res.status(200).send({
            status: true,
            lable: lable,
        });
    }

    async getOneLabel(req, res) {
        let lableId = req.params.id;
        let lable = await LabelModal.findById(lableId).lean()
        if (!lable) {
            return res.status(404).send({ message: "lable  doesnt exist" })
        }

        res.status(200).send({
            status: true,
            lable: lable,
        });

    }

    async getOneLabelAndRemove(req, res) {
        let lableId = req.params.id;
        let lable = await LabelModal.findByIdAndRemove(lableId)
        let status = false
        if (lable) {
            status = true
        }
        res.status(200).send({
            status: status,
            lable: lable,
        });

    }

    async getOneLabelAndUpdate(req, res) {
        let lableId = req.params.id;
        let lable = await LabelModal.findById(lableId)
        if (!lable) {
            return res.status(404).send({ message: "lable doesnt exist" })
        }

        let { error } = validate.validateUpdateLable(req.body)
        if (error) {
            return res.status(400).send({
                message: "failed",
                result: error
            })
        }

        lable.set(req.body)

        await lable.save()

        res.status(200).send({
            status: true,
            lable: lable,
        });

    }
}

module.exports = Label;