const MedicalCenterModal = require("../models/master/MedicalCenter");

class MedicalCenter {
  /**
   * @function - Get all the registered users from the db
   *
   * @param - Express.req , Express.res
   *
   * @returns - List of registered users
   */

  async createMedicalCenter(req, res) {
    // throw new Error("could not create a user")


    let medicalCenter = new MedicalCenterModal({ ...req.body });

    await medicalCenter.save();

    return res.status(200).send({
      message: "Medical Center Created",
      result: medicalCenter,
    });
  }

  async getAllMedicalCenter(req, res) {
    let limit;
    let page;
    if (req.query.limit) {
      limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
      page = req.query.page
        ? parseInt(req.query.page)
          ? parseInt(req.query.page)
          : 1
        : 1;
    }

    const createdAt = req.query.createdAt
      ? req.query.createdAt == "desc"
        ? -1
        : 1
      : 1;

    const medicalCenter = await MedicalCenterModal.find({})
      .limit(limit)
      .populate("addressDetails.countryId")
      .populate("addressDetails.cityId")

      .populate("businessId")
      .populate("stations")
      .populate("stations")
      .skip((page - 1) * limit)
      .sort({ createdAt: createdAt })
      .lean();

    res.status(200).send({
      status: true,
      medicalCenter: medicalCenter,
    });
  }


  async getOneMedicalCenterAndRemove(req, res) {
    let medicalCenterId = req.params.id;
    let medicalCenter = await MedicalCenterModal.findByIdAndRemove(
      medicalCenterId
    );
    let status = false;
    if (medicalCenter) {
      status = true;
    }
    res.status(200).send({
      status: status,
      medicalCenter: medicalCenter,
    });
  }

  async getOneMedicalCenterAndUpdate(req, res) {
    let medicalCenterId = req.params.id;
    let medicalCenter = await MedicalCenterModal.findById(medicalCenterId);
    console.log(medicalCenter);

    if (!medicalCenter) {
      return res.status(404).send({ message: "medicalCenter doesnt exist" });
    }

    medicalCenter.set(req.body);

    await medicalCenter.save();

    res.status(200).send({
      status: true,
      medicalCenter: medicalCenter,
    });
  }
}

module.exports = MedicalCenter;
