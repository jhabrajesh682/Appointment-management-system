const AppointmentAudits = require('../models/appointment/AppointmentAudit')

const validate = require('../validators/appointmentAudit.validator')

class AppointmentAudit {
  /**
     * @function - Get all the registered users from the db
     *
     * @param - Express.req , Express.res
     *
     * @returns - List of registered users
     */



  async getAllAppointmentAudit(req, res) {

    let { error } = validate.validateQueryAppointmentAudit(req.query)
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
    if (req.query.countryId) req.query['country.countryId'] = req.query.countryId; delete req.query.countryId;
    if (req.query.countryName) req.query['country.countryName'] = req.query.countryName; delete req.query.countryName;
    if (req.query.cityId) req.query['city.cityId'] = req.query.cityId; delete req.query.cityId;
    if (req.query.cityName) req.query['city.cityName'] = req.query.cityName; delete req.query.cityName;
    if (req.query.medicalCenterId) req.query['medicalCenter.medicalCenterId'] = req.query.medicalCenterId; delete req.query.medicalCenterId;
    if (req.query.medicalCenterName) req.query['medicalCenter.medicalCenterName'] = req.query.medicalCenterName; delete req.query.medicalCenterName;


    const createdAt = req.query.sort ? (req.query.sort == 'desc' ? -1 : 1) : 1
    if (req.query.sort) delete req.query.sort;

    const appointmentAudit = await AppointmentAudits.find(req.query).limit(limit).skip((page - 1) * limit).sort({ createdAt: createdAt }).lean()
    if (req.query.sort) delete req.query.sort;

    res.status(200).send({
      status: true,
      appointmentAudit: appointmentAudit,
    });
  }

  async getOneAppointmentAudit(req, res) {
    let appointmentAuditId = req.params.id;
    let appointmentAudit = await AppointmentAudits.findById(appointmentAuditId).lean()
    if (!appointmentAudit) {
      return res.status(404).send({ message: "appointmentAudit  doesnt exist" })
    }

    res.status(200).send({
      status: true,
      appointmentAudit: appointmentAudit,
    });

  }



}

module.exports = AppointmentAudit;