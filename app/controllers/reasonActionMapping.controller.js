const ReasonActionMappingModel = require("../models/appointment/reasonAndActionMapping");
const validators = require("../validators/reasonActionMapping.validator");

class ReasonAndActionMapping {
  async createReasonActionMapping(req, res) {
    // throw new Error("could not create a user")
    let { error } = validators.validateReasonAndActionMapping(req.body);
    if (error) {
      return res.status(400).send({
        message: "failed",
        result: error,
      });
    }

    let createReasonAction = new ReasonActionMappingModel(req.body);

    createReasonAction.save();

    return res.status(200).send({
      message: "ReasonAndActionMapping Created",
      result: createReasonAction,
    });
  }

  async getAllReasonAndAction(req, res) {


    const reasonActionmaps = await ReasonActionMappingModel.find({})
      .populate("action")
      .populate("reason")
      .lean();

    res.status(200).send({
      status: true,
      ReasonAction: reasonActionmaps,
    });
  }
}

module.exports = ReasonAndActionMapping;
