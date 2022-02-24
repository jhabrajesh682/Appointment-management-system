const SlotAudits = require('../models/appointment/SlotAudit')

const validate = require('../validators/slotAudit.validator')

class SlotAudit {
    /**
       * @function - Get all the registered users from the db
       *
       * @param - Express.req , Express.res
       *
       * @returns - List of registered users
       */



    async getAllSlotAudit(req, res) {

        let { error } = validate.validateQuerySlotAudit(req.query)
        if (error) {
            return res.status(400).send({
                message: "failed",
                result: error
            })
        }

        let limit
        let page
        if (req.query.limit) {
            limit = (parseInt(req.query.limit) ? parseInt(req.query.limit) : 10);
            page = req.query.page ? (parseInt(req.query.page) ? parseInt(req.query.page) : 1) : 1;
            delete req.query.limit
        }
        if (req.query.page) delete req.query.page;

        if (req.query.reasonForAppointment) req.query['serviceCategory.reasonForAppointment'] = req.query.reasonForAppointment; delete req.query.reasonForAppointment;
        if (req.query.actionRequired) req.query['serviceCategory.actionRequired'] = req.query.actionRequired; delete req.query.actionRequired;



        const createdAt = req.query.sort ? (req.query.sort == 'desc' ? -1 : 1) : 1

        const slotAudit = await SlotAudits.find(req.query).limit(limit).skip((page - 1) * limit).sort({ createdAt: createdAt }).lean()

        res.status(200).send({
            status: true,
            slotAudit: slotAudit,
        });
    }

    async getOneSlotAudit(req, res) {
        let slotAuditId = req.params.id;
        let slotAudit = await SlotAudits.findById(slotAuditId).lean()
        if (!slotAudit) {
            return res.status(404).send({ message: "slotAudit  doesnt exist" })
        }

        res.status(200).send({
            status: true,
            slotAudit: slotAudit,
        });

    }



}

module.exports = SlotAudit;