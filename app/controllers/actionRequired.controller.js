const Actions = require('../models/appointment/ActionMaster')
const validate = require('../validators/actionRequired.validator')

class ActionRequired {
  /**
     * @function - Get all the registered users from the db
     *
     * @param - Express.req , Express.res
     *
     * @returns - List of registered users
     */

  async createAction(req, res) {
    // throw new Error("could not create a user")
    // console.log(" in the controller");

    let { error } = validate.validateAction(req.body)
    if (error) {
      return res.status(400).send({
        message: "failed",
        result: error
      })
    }

    let actionRequired = new Actions({
      actionName: req.body.actionName,
      actionDiscription: req.body.actionDiscription,
    })

    await actionRequired.save()

    return res.status(200).send({
      message: "ActionRequired Created",
      result: actionRequired
    });
  }

  async getAllAction(req, res) {

    let limit
    let page
    if (req.query.limit) {
      limit = (parseInt(req.query.limit) ? parseInt(req.query.limit) : 10);
      page = req.query.page ? (parseInt(req.query.page) ? parseInt(req.query.page) : 1) : 1;
    }

    const createdAt = req.query.sort ? (req.query.sort == 'desc' ? -1 : 1) : 1

    const actionRequired = await Actions.find({}).limit(limit).skip((page - 1) * limit).sort({ createdAt: createdAt }).lean()

    res.status(200).send({
      status: true,
      actionRequired: actionRequired,
    });
  }

  async getOneAction(req, res) {
    let actionId = req.params.id;
    let actionRequired = await Actions.findById(actionId).lean()
    if (!actionRequired) {
      return res.status(404).send({ message: "actionRequired  doesnt exist" })
    }

    res.status(200).send({
      status: true,
      actionRequired: actionRequired,
    });

  }

  async getOneActionAndRemove(req, res) {
    let actionId = req.params.id;
    let actionRequired = await Actions.findByIdAndRemove(actionId)
    let status = false
    if (actionRequired) {
      status = true
    }
    res.status(200).send({
      status: status,
      actionRequired: actionRequired,
    });

  }

  async getOneActionAndUpdate(req, res) {
    let actionId = req.params.id;
    let actionRequired = await Actions.findById(actionId)
    if (!actionRequired) {
      return res.status(404).send({ message: "actionRequired doesnt exist" })
    }

    let { error } = validate.validateUpdateAction(req.body)
    if (error) {
      return res.status(400).send({
        message: "failed",
        result: error
      })
    }

    actionRequired.set(req.body)

    await actionRequired.save()

    res.status(200).send({
      status: true,
      actionRequired: actionRequired,
    });

  }
}

module.exports = ActionRequired;