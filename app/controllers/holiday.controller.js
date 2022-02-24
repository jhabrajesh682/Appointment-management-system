const Holidays = require('../models/appointment/HolidayMaster')
const validate = require('../validators/holiday.validator')

class Holiday {
  /**
     * @function - Get all the registered users from the db
     *
     * @param - Express.req , Express.res
     *
     * @returns - List of registered users
     */

  async createHoliday(req, res) {
    // throw new Error("could not create a user")
    let { error } = validate.validateHoliday(req.body)
    if (error) {
      return res.status(400).send({
        message: "failed",
        result: error
      })
    }

    let holiday = new Holidays({
      holidayName: req.body.holidayName,
      holidayDiscription: req.body.holidayDiscription,
      date: req.body.date,
      timeZone: req.body.timeZone,
      city: req.body.city,
      country: req.body.country
    })

    await holiday.save()

    return res.status(200).send({
      message: "Holiday Created",
      result: holiday
    });
  }

  async getAllHoliday(req, res) {

    let limit
    let page
    if (req.query.limit) {
      limit = (parseInt(req.query.limit) ? parseInt(req.query.limit) : 10);
      page = req.query.page ? (parseInt(req.query.page) ? parseInt(req.query.page) : 1) : 1;
    }

    const createdAt = req.query.sort ? (req.query.sort == 'desc' ? -1 : 1) : 1

    const holiday = await Holidays.find({}).limit(limit).skip((page - 1) * limit).sort({ createdAt: createdAt }).lean()

    res.status(200).send({
      status: true,
      holiday: holiday,
    });
  }

  async getHolidayByMedicalCenter(req, res) {

    let cityId = req.params.cityId;

    console.log('CityId ------->', cityId);

    let holiday = await Holidays.find({ 'city.cityId': cityId }).lean()
    // if (!holiday) {
    //   return res.status(404).send({ message: "holiday  doesnt exist" })
    // }

    res.status(200).send({
      status: true,
      holiday: holiday,
    });

  }

  async getOneHoliday(req, res) {
    let holidayId = req.params.id;
    let holiday = await Holidays.findById(holidayId).lean()
    if (!holiday) {
      return res.status(404).send({ message: "holiday  doesnt exist" })
    }

    res.status(200).send({
      status: true,
      holiday: holiday,
    });

  }

  async getOneHolidayAndRemove(req, res) {
    let holidayId = req.params.id;
    let holiday = await Holidays.findByIdAndRemove(holidayId)
    let status = false
    if (holiday) {
      status = true
    }
    res.status(200).send({
      status: status,
      holiday: holiday,
    });

  }

  async getOneHolidayAndUpdate(req, res) {
    let holidayId = req.params.id;
    let holiday = await Holidays.findById(holidayId)
    if (!holiday) {
      return res.status(404).send({ message: "holiday doesnt exist" })
    }

    let { error } = validate.validateUpdateHoliday(req.body)
    if (error) {
      return res.status(400).send({
        message: "failed",
        result: error
      })
    }

    holiday.set(req.body)

    await holiday.save()

    res.status(200).send({
      status: true,
      holiday: holiday,
    });

  }
}

module.exports = Holiday;