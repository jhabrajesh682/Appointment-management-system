const SlotGroups = require("../models/appointment/SlotGroup");
const Holidays = require("../models/appointment/HolidayMaster");
const Slots = require("../models/appointment/Slot");
const validate = require("../validators/fetchSlotGroup.validator");
const moment = require("moment");

class SlotGroup {
    /**
     * @function - Get all the registered users from the db
     *
     * @param - Express.req , Express.res
     *
     * @returns - List of registered users
     */



    async fetchSlotGroup(req, res) {


        let { error } = validate.validateSlotGroupFetch(req.body);
        if (error) {
            return res.status(400).send({
                message: "failed",
                result: error,
            });
        }
        console.log('Medical Id ------------->', req.body);

        let { medicalCenterId, date, cityId } = req.body;
        let holiday = await Holidays.find({ "city.cityId": cityId }).lean()
        console.log(holiday);
        holiday = holiday.map(x => moment(x.date).format('YYYY-MM-DD'))
        let medicalCenterTimeSlots = await SlotGroups.find({ 'medicalCenter.medicalCenterId': medicalCenterId, date: { $gte: date } }).and({ date: { $nin: holiday } }).lean().select("date ")

        console.log(holiday, "holiday");
        return res.status(200).send({
            status: true,
            slotGroup: medicalCenterTimeSlots,
        });

    }

    async fetchSlots(req, res) {


        let slotGroupId = req.params.id;

        console.log('Medical Id ------------->', req.body);

        // let { medicalCenterId, date } = req.body;

        let medicalCenterTimeSlots = await Slots.find({ slotGroup: slotGroupId }).select('starttime endtime availableLimit consumedCount isAvailable').lean()

        let uniqueobj = getUniqueObj(medicalCenterTimeSlots, 'starttime')
        let result = uniqueobj.map(x => {
            return {
                start_time: x.starttime,
                end_time: x.endtime,
                slotIds: medicalCenterTimeSlots.filter(y => y.starttime == x.starttime && y.availableLimit > 0)
            }
        })
        result = result.map(x => {
            let availabbleCounter = x.slotIds.filter(y => y.isAvailable)
            if (availabbleCounter.length > 0) {
                x.isAvailable = true
            } else {
                x.isAvailable = false
            }
            x.slotIds = x.slotIds.map(y => y._id)
            return x
        })
        console.log(result);


        // console.log(medicalCenterTimeSlots);
        return res.status(200).send({
            status: true,
            slotGroup: result,
        });

    }


}

function getUniqueObj(array, feild) {
    const result = [];
    const map = new Map();
    for (const item of array) {
        if (!map.has(item[feild])) {
            map.set(item[feild], true);    // set any value to Map
            result.push(item);
        }
    }
    return result
}

module.exports = SlotGroup;
