const Slots = require("../models/appointment/Slot");
const validate = require("../validators/slot.validator");

class Slot {
  /**
   * @function - Get all the registered users from the db
   *
   * @param - Express.req , Express.res
   *
   * @returns - List of registered users
   */

  async createSlot(req, res) {
    // throw new Error("could not create a user")
    // console.log(" in the controller");

    let { error } = validate.validateSlot(req.body);
    if (error) {
      return res.status(400).send({
        message: "failed",
        result: error,
      });
    }

    let slot = new Slots({
      date: req.body.date,
      starttime: req.body.starttime,
      endtime: req.body.endtime,
      serviceCategory: {
        reasonForAppointment: req.body.reasonForAppointment,
        actionRequired: req.body.actionRequired,
      },
      availableLimit: req.body.availableLimit,
      slotGroup: req.body.slotGroup,
      templateId: req.body.templateId,
    });

    await slot.save();

    return res.status(200).send({
      message: "Slot Created",
      result: slot,
    });
  }

  async getAllSlot(req, res) {
    let { error } = validate.validateQuerySolt(req.query);
    if (error) {
      return res.status(400).send({
        message: "failed",
        result: error,
      });
    }
    let limit;
    let page;
    if (req.query.limit) {
      limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
      page = req.query.page
        ? parseInt(req.query.page)
          ? parseInt(req.query.page)
          : 1
        : 1;
      delete req.query.limit;
    }
    if (req.query.page) delete req.query.page;

    if (req.query.reasonForAppointment)
      req.query["serviceCategory.reasonForAppointment"] =
        req.query.reasonForAppointment;
    delete req.query.reasonForAppointment;
    if (req.query.actionRequired)
      req.query["serviceCategory.actionRequired"] = req.query.actionRequired;
    delete req.query.actionRequired;

    console.log(req.query);

    const createdAt = req.query.sort ? (req.query.sort == "desc" ? -1 : 1) : 1;
    if (req.query.sort) delete req.query.sort;

    const slot = await Slots.find(req.query)
      .populate("Appointments")
      .populate("serviceCategory.actionRequired")
      .populate("serviceCategory.reasonForAppointment")
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: createdAt })
      .lean();

    res.status(200).send({
      status: true,
      slot: slot,
    });
  }

  async getOneSlot(req, res) {
    let slotId = req.params.id;
    let slot = await Slots.findById(slotId)
      .populate("Appointments")
      .populate("serviceCategory.actionRequired")
      .populate("serviceCategory.reasonForAppointment")
      .lean();
    if (!slot) {
      return res.status(404).send({ message: "slot  doesnt exist" });
    }

    res.status(200).send({
      status: true,
      slot: slot,
    });
  }

  async getOneSlotAndRemove(req, res) {
    let slotId = req.params.id;
    let slot = await Slots.findByIdAndRemove(slotId);
    let status = false;
    if (slot) {
      status = true;
    }
    res.status(200).send({
      status: status,
      slot: slot,
    });
  }

  async getOneSlotAndUpdate(req, res) {
    let slotId = req.params.id;
    let slot = await Slots.findById(slotId);
    if (!slot) {
      return res.status(404).send({ message: "slot doesnt exist" });
    }

    let { error } = validate.validateUpdateSlot(req.body);
    if (error) {
      return res.status(400).send({
        message: "failed",
        result: error,
      });
    }

    slot.set(req.body);

    await slot.save();

    res.status(200).send({
      status: true,
      slot: slot,
    });
  }

  async getSlotsByUserDetails(req, res) {
    let { error } = validate.validateUserDetails(req.body);
    if (error) {
      return res.status(400).send({
        message: "failed",
        result: error,
      });
    }
    let query = {
      "serviceCategory.reasonForAppointment": req.body.reasonForAppointment,
      "serviceCategory.actionRequired": { $in: req.body.actionRequired },
      slotGroup: req.body.slotGroup,
    };
    if (req.body.isMultiple) {
      delete query["serviceCategory.actionRequired"];
    }
    console.log(query);
    let slot = await Slots.find(query).lean();

    res.status(200).send({
      status: true,
      slots: slot,
    });
  }

  async getSlotsBySlotGroup(req, res) {
    let { error } = validate.validateBySlotGroup(req.body);

    console.log("Error ------->", error);

    if (error) {
      return res.status(400).send({
        message: "failed",
        result: error,
      });
    }
    let query = {
      slotGroup: req.body.slotGroup
    };

    console.log("query Data ---------->", query);

    console.log(query);
    let slot = await Slots.find(query).lean();

    res.status(200).send({
      status: true,
      slots: slot,
    });
  }
  async getSlotsBySlotGroupNonGroup(req, res) {
    let { error } = validate.validateBySlotGroup(req.body);

    console.log("Error ------->", error);

    if (error) {
      return res.status(400).send({
        message: "failed",
        result: error,
      });
    }
    let query = {
      slotGroup: req.body.slotGroup, availableLimit: { $gt: 0 }
    };

    console.log("query Data ---------->", query);

    console.log(query);
    let slot = await Slots.find(query).lean();

    res.status(200).send({
      status: true,
      slots: slot,
    });
  }

  async bulkReopenSlots(req, res) {
    let reopenSlotsList = req.body.submitArray;

    console.log('ReopenList ----->', reopenSlotsList);

    let data = { _id: { $in: [...reopenSlotsList] } };

    console.log("Data ------->", data);

    let slot = await Slots.updateMany(data, { $set: { isAvailable: true } });

    // await Slots.updateMany(
    //   { slotId: { $in: [...reopenSlotsList] } },
    //   { $set: { isAvailable: true } }
    // );

    res.status(200).send({
      status: true,
      slot: slot,
    });
  }

}

module.exports = Slot;
