const SlotGroups = require("../models/appointment/SlotGroup");
const validate = require("../validators/slotGroup.validator");
var moment = require("moment");

class SlotGroup {
  /**
   * @function - Get all the registered users from the db
   *
   * @param - Express.req , Express.res
   *
   * @returns - List of registered users
   */

  async createSlotGroup(req, res) {
    // throw new Error("could not create a user")
    // console.log(" in the controller");

    let { error } = validate.validateSlotGroup(req.body);
    if (error) {
      return res.status(400).send({
        message: "failed",
        result: error,
      });
    }

    let slotGroup = new SlotGroups({
      date: req.body.date,
      country: req.body.country,
      city: req.body.city,
      timeZone: req.body.timeZone,

      medicalCenter: req.body.medicalCenter,
      loggedUserID: req.body.loggedUserID,

      loggedDate: req.body.loggedDate,

      templateId: req.body.templateId,
      isPublished: req.body.isPublished,
    });

    await slotGroup.save();

    return res.status(200).send({
      message: "SlotGroup Created",
      result: slotGroup,
    });
  }

  async getAllSlotGroup(req, res) {
    let { error } = validate.validateQuerySlotGroup(req.query);
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
    if (req.query.countryId)
      req.query["country.countryId"] = req.query.countryId;
    delete req.query.countryId;
    if (req.query.countryName)
      req.query["country.countryName"] = req.query.countryName;
    delete req.query.countryName;
    if (req.query.cityId) req.query["city.cityId"] = req.query.cityId;
    delete req.query.cityId;
    if (req.query.cityName) req.query["city.cityName"] = req.query.cityName;
    delete req.query.cityName;
    if (req.query.medicalCenterId)
      req.query["medicalCenter.medicalCenterId"] = req.query.medicalCenterId;
    delete req.query.medicalCenterId;
    if (req.query.medicalCenterName)
      req.query["medicalCenter.medicalCenterName"] =
        req.query.medicalCenterName;
    delete req.query.medicalCenterName;

    console.log(req.query);

    const createdAt = req.query.sort ? (req.query.sort == "desc" ? -1 : 1) : 1;
    if (req.query.sort) delete req.query.sort;

    const slotGroup = await SlotGroups.find(req.query)
      .populate({
        path: "slots",
        populate: [
          { path: "Appointments" },
          { path: "serviceCategory.actionRequired" },
          { path: "serviceCategory.reasonForAppointment" },
        ],
      })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: createdAt })
      .lean();

    res.status(200).send({
      status: true,
      slotGroup: slotGroup,
    });
  }

  async getOneSlotGroup(req, res) {
    let slotGroupId = req.params.id;
    let slotGroup = await SlotGroups.findById(slotGroupId)
      .populate({
        path: "slots",
        populate: [
          // {path:'Appointments'},
          { path: "serviceCategory.actionRequired" },
          { path: "serviceCategory.reasonForAppointment" },
        ],
      })
      .lean();
    if (!slotGroup) {
      return res.status(404).send({ message: "slotGroup  doesnt exist" });
    }

    res.status(200).send({
      status: true,
      slotGroup: slotGroup,
    });
  }

  async getOneSlotGroupAndRemove(req, res) {
    let slotGroupId = req.params.id;
    let slotGroup = await SlotGroups.findByIdAndRemove(slotGroupId);
    let status = false;
    if (slotGroup) {
      status = true;
    }
    res.status(200).send({
      status: status,
      slotGroup: slotGroup,
    });
  }

  async getOneSlotGroupAndUpdate(req, res) {
    let slotGroupId = req.params.id;
    let slotGroup = await SlotGroups.findById(slotGroupId);
    if (!slotGroup) {
      return res.status(404).send({ message: "slotGroup doesnt exist" });
    }

    let { error } = validate.validateUpdateSlotGroup(req.body);
    if (error) {
      return res.status(400).send({
        message: "failed",
        result: error,
      });
    }

    slotGroup.set(req.body);

    await slotGroup.save();

    res.status(200).send({
      status: true,
      slotGroup: slotGroup,
    });
  }

  async getSlotGroupsforNextFourWeeks(req, res) {
    let { error } = validate.validationForFourWeekSlotGroup(req.body);
    if (error) {
      return res.status(400).send({
        message: "failed",
        result: error,
      });
    }

    let fromDate = moment(req.body.fromDate).format("YYYY-MM-DD");
    let toDate = moment(req.body.fromDate).add(4, "weeks").format("YYYY-MM-DD");
    let medicalCenterId = req.body.medicalCenterId;

    const slotGroup = await SlotGroups.find({
      date: { $gte: fromDate, $lte: toDate },
      "medicalCenter.medicalCenterId": medicalCenterId,
    })
      // .populate({
      //         path:'slots',
      //         populate:[
      //             // {path:'Appointments'},
      //             {path:'serviceCategory.actionRequired'},
      //             {path:'serviceCategory.reasonForAppointment'}
      //         ]
      //     })
      .lean();

    res.status(200).send({
      status: true,
      slotGroup: slotGroup,
    });
  }

  async getAllSlotsByDateWise(req, res) {

    console.log('Medical Id ------------->', req.body);

    let medicalId = req.body.medicalCenterId

    let medicalCenterTimeSlots = await SlotGroups.find({ 'medicalCenter.medicalCenterId': medicalId })
    .populate({
      path: "slots",
      populate: [
        { path: "Appointments" },
        { path: "serviceCategory.actionRequired" },
        { path: "serviceCategory.reasonForAppointment" },
      ],
    })


    

    console.log('medicalCenterTimeSlots ---------->', medicalCenterTimeSlots);
  }

}

module.exports = SlotGroup;
