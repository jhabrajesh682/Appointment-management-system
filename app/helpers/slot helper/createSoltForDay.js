
const reasonActionMapping = require("../../models/appointment/reasonAndActionMapping");
const Slots = require('./slot')
const moment = require('moment')

module.exports = async function createSlots(obj) {
    let slotObj = [];
    let reasonaction = await reasonActionMapping.find({})
        .populate("action")
        .populate("reason")
        .lean()

    console.log(reasonaction, "reasonaction");


    let date = "2020-01-01";

    let interval = obj.interval
    let start = moment(date + ' ' + obj.startTime)
    let breakStart = moment(date + ' ' + obj.break.starttime)
    let end = moment(date + ' ' + obj.endTime)
    let breakEnd = moment(date + ' ' + obj.break.endtime)

    let beforeBreakIterations = breakStart.diff(start, 'minutes') / interval
    let afterBreakIterations = end.diff(breakEnd, 'minutes') / interval

    console.log('afterBreakIterations ------>', afterBreakIterations);



    let daySlots = []
    let beforBreakTimeArray = []
    let afterBreakTimeArray = []

    for (let index = 0; index < beforeBreakIterations; index++) {
        let time = start.format('HH:mm')
        if (index == 0) {
            beforBreakTimeArray.push(time)
        }
        start = start.add(interval, 'minutes')
        time = start.format('HH:mm')
        beforBreakTimeArray.push(time)
    }

    for (let index = 0; index < beforBreakTimeArray.length - 1; index++) {
        const elementStart = beforBreakTimeArray[index];
        const elementEnd = beforBreakTimeArray[index + 1];
        let slotObj = {
            start: elementStart,
            end: elementEnd
        }
        daySlots.push(slotObj)
    }
    console.log(beforBreakTimeArray, "before array");

    for (let index = 0; index < afterBreakIterations; index++) {
        let time = breakEnd.format('HH:mm')
        if (index == 0) {
            afterBreakTimeArray.push(time)
        }
        breakEnd = breakEnd.add(interval, 'minutes')
        time = breakEnd.format('HH:mm')
        afterBreakTimeArray.push(time)
    }

    console.log('afterBreakTimeArray ------->', afterBreakTimeArray);

    for (let index = 0; index < afterBreakTimeArray.length - 1; index++) {
        const elementStart = afterBreakTimeArray[index];
        const elementEnd = afterBreakTimeArray[index + 1];
        let slotObj = {
            start: elementStart,
            end: elementEnd
        }
        daySlots.push(slotObj)
    }
    console.log(afterBreakTimeArray, "after array");

    console.log(daySlots, "daySlots");







    for (const iterator of reasonaction) {

        let daySlotArray = []
        for (const daySlot of daySlots) {
            let action = iterator.action.map((item) => item._id)
            let reason = iterator.reason.map((item) => item._id)
            let slot = new Slots(daySlot.start, daySlot.end, action, reason, 0)
            // console.log(slot);

            daySlotArray.push(slot)
        }
        slotObj = slotObj.concat(daySlotArray)
    }
    // console.log(slotObj.length);
    console.log(slotObj);

    return slotObj

}


