const Reasons = require('../models/appointment/ReasonMaster')
const validate = require('../validators/reasonRequired.validator')

class ReasonRequired {
  /**
     * @function - Get all the registered users from the db
     *
     * @param - Express.req , Express.res
     *
     * @returns - List of registered users
     */

  async createReason(req, res) {
    
    let { error } = validate.validateReason(req.body)
    if (error) {
      return res.status(400).send({
        message: "failed",
        result: error
      })
    }

    let reasonRequired = new Reasons({
      reasonName: req.body.reasonName,
      reasonDiscription: req.body.reasonDiscription,
    })

    await reasonRequired.save()

    return res.status(200).send({
      message: "ReasonRequired Created",
      result: reasonRequired
    });
  }

  async getAllReason(req, res) {

    let limit
    let page
    if (req.query.limit) {
      limit = (parseInt(req.query.limit) ? parseInt(req.query.limit) : 10);
      page = req.query.page ? (parseInt(req.query.page) ? parseInt(req.query.page) : 1) : 1;
    }

    const createdAt = req.query.sort ? (req.query.sort == 'desc' ? -1 : 1) : 1

    const reasonRequired = await Reasons.find({}).limit(limit).skip((page - 1) * limit).sort({ createdAt: createdAt }).lean()

    res.status(200).send({
      status: true,
      reasonRequired: reasonRequired,
    });
  }

  async getOneReason(req, res) {
    let reasonId = req.params.id;
    let reasonRequired = await Reasons.findById(reasonId).lean()
    if (!reasonRequired) {
      return res.status(404).send({ message: "reasonRequired  doesnt exist" })
    }

    res.status(200).send({
      status: true,
      reasonRequired: reasonRequired,
    });

  }

  async getOneReasonAndRemove(req, res) {
    let reasonId = req.params.id;
    let reasonRequired = await Reasons.findByIdAndRemove(reasonId)
    let status = false
    if (reasonRequired) {
      status = true
    }
    res.status(200).send({
      status: status,
      reasonRequired: reasonRequired,
    });

  }

  async getOneReasonAndUpdate(req, res) {
    let reasonId = req.params.id;
    let reasonRequired = await Reasons.findById(reasonId)
    if (!reasonRequired) {
      return res.status(404).send({ message: "reasonRequired doesnt exist" })
    }

    let { error } = validate.validateUpdateReason(req.body)
    if (error) {
      return res.status(400).send({
        message: "failed",
        result: error
      })
    }

    reasonRequired.set(req.body)

    await reasonRequired.save()

    res.status(200).send({
      status: true,
      reasonRequired: reasonRequired,
    });

  }
}

module.exports = ReasonRequired;