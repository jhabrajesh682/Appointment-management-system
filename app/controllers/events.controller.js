const Holidays = require('../models/appointment/HolidayMaster')
const Appointments = require('../models/appointment/Appointment')
const Events = require('../models/appointment/EventsMaster')
const validate = require('../validators/events.validator')

class Event {
    /**
       * @function - Get all the registered users from the db
       *
       * @param - Express.req , Express.res
       *
       * @returns - List of registered users
       */

    async createEvent(req, res) {
        // throw new Error("could not create a user")
        let { error } = validate.validateEvents(req.body)
        if (error) {
            return res.status(400).send({
                message: "failed",
                result: error
            })
        }
        // console.log(req.body);
        let appointment = await Appointments.find({ status: "booked", "city.cityId": req.body.city.cityId, appointmentDate: req.body.start }).lean()
        console.log(appointment);
        if (appointment.length > 0) {

            let medicalcenters = appointment.map(x => x.medicalCenter.medicalCenterName).filter((value, index, self) => {
                return self.indexOf(value) === index;
            })
            console.log(medicalcenters);
            // 409 is for conflict
            return res.status(409).send({
                status: false,
                message: "failed",
                result: medicalcenters
            })
        }
        // console.log(appointment, "🔖");

        let holiday = new Holidays({
            holidayName: req.body.title,
            holidayDiscription: req.body.holidayDiscription,
            date: req.body.start,
            timeZone: req.body.timeZone,
            city: req.body.city,
            country: req.body.country
        })
        let event = new Events({
            title: req.body.title,
            start: req.body.start,
            end: req.body.end,
            className: req.body.className,
            holiday: holiday._id,
            city: req.body.city

        })

        await holiday.save()
        await event.save()

        return res.status(200).send({
            message: "Event Created",
            result: event
        });
    }

    async getAllEvent(req, res) {

        let limit
        let page
        if (req.query.limit) {
            limit = (parseInt(req.query.limit) ? parseInt(req.query.limit) : 10);
            page = req.query.page ? (parseInt(req.query.page) ? parseInt(req.query.page) : 1) : 1;
        }

        const createdAt = req.query.sort ? (req.query.sort == 'desc' ? -1 : 1) : 1

        const events = await Events.find({}).populate('holiday').limit(limit).skip((page - 1) * limit).sort({ createdAt: createdAt }).lean()

        res.status(200).send({
            status: true,
            events: events,
        });
    }
    async getAllEventByCity(req, res) {

        let cityId = req.params.cityId
        let limit
        let page
        if (req.query.limit) {
            limit = (parseInt(req.query.limit) ? parseInt(req.query.limit) : 10);
            page = req.query.page ? (parseInt(req.query.page) ? parseInt(req.query.page) : 1) : 1;
        }

        const createdAt = req.query.sort ? (req.query.sort == 'desc' ? -1 : 1) : 1

        const events = await Events.find({ "city.cityId": cityId }).populate('holiday').limit(limit).skip((page - 1) * limit).sort({ createdAt: createdAt }).lean()

        res.status(200).send({
            status: true,
            events: events,
        });
    }



    async getOneEvent(req, res) {
        let eventId = req.params.id;
        let event = await Events.findById(eventId).populate('holiday').lean()
        if (!event) {
            return res.status(404).send({ message: "event  doesnt exist" })
        }

        res.status(200).send({
            status: true,
            event: event,
        });

    }

    async getOneEventAndRemove(req, res) {
        let eventId = req.params.id;
        console.log(eventId);
        let event = await Events.findById(eventId)
        console.log(event);
        let holiday = await Holidays.findById(event.holiday)
        console.log(holiday);

        await holiday.remove()
        await event.remove()

        res.status(200).send({
            message: "Holiday removed"
        });

    }

    async getOneEventAndUpdate(req, res) {
        let eventId = req.params.id;
        let event = await Events.findById(eventId)
        let holiday = await Holidays.findById(event.holiday)
        if (!event) {
            return res.status(404).send({ message: "event doesnt exist" })
        }

        let { error } = validate.validateUpdateEvents(req.body)
        if (error) {
            return res.status(400).send({
                message: "failed",
                result: error
            })
        }

        let holidayObj = {}
        let eventObj = {}

        if (req.body.title) {
            holidayObj.holidayName = req.body.title
            eventObj.title = req.body.title
        }
        if (req.body.start) {
            holidayObj.date = req.body.start
            eventObj.start = req.body.start
            eventObj.end = req.body.end

        }
        if (req.body.holidayDiscription) {
            holidayObj.holidayDiscription = req.body.holidayDiscription
        }


        holiday.set(holidayObj)
        event.set(eventObj)


        await holiday.save()
        await event.save()

        res.status(200).send({
            status: true,
            event: event,
            holiday: holiday
        });

    }
}

module.exports = Event;