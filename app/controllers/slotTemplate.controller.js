const SlotTemplateModal = require("../models/appointment/SlotTemplate");
const Holiday = require("../models/appointment/HolidayMaster");
const SlotGroup = require("../models/appointment/SlotGroup");
const Slot = require("../models/appointment/Slot");
const Appointments = require("../models/appointment/Appointment");
const AppointmentAudits = require("../models/appointment/AppointmentAudit");

const validate = require("../validators/slotTemplate.validator");

let moment = require("moment");
const ActionMaster = require("../models/appointment/ActionMaster");
const ReasonMaster = require("../models/appointment/ReasonMaster");
const createSlots = require('../helpers/slot helper/createSoltForDay')
const util = require('util');
const AppointmentAudit = require("../models/appointment/AppointmentAudit");



class SlotTemplate {
  /**
   * @function - Get all the registered users from the db
   *
   * @param - Express.req , Express.res
   *
   * @returns - List of registered users
   */

  // async creatfun(req, res) {
  //   console.log("dun");

  //   let daySlotsArray = await createSlots()
  //   res.send(daySlotsArray)
  // }

  async createSlotTemplate(req, res) {

    console.log(req.body.medicalCenter.medicalCenterId, "req.body.medicalCenter");

    let existSlotTemplate = await SlotTemplateModal.find({ 'medicalCenter.medicalCenterId': req.body.medicalCenter.medicalCenterId })

    console.log('Exist Slot Template --------->', existSlotTemplate.length);

    if (existSlotTemplate.length == 0) {
      let { error } = validate.validateSlotTemplate(req.body);
      if (error) {
        return res.status(400).send({
          message: "failed",
          result: error,
        });
      }
      let daySlotsArray = await createSlots(req.body.timming)
      console.log(JSON.stringify(daySlotsArray.filter(x => x.starttime == "08:30"), null, 4), "daySlotsArray");

      let weekObj = {
        mondaySlot: daySlotsArray,
        tuesdaySlot: daySlotsArray,
        wednesdaySlot: daySlotsArray,
        thursdaySlot: daySlotsArray,
        fridaySlot: daySlotsArray,
        saturdaySlot: daySlotsArray,
        sundaySlot: daySlotsArray,
      }

      let slotTemplate = new SlotTemplateModal({
        templateName: req.body.templateName,
        timeZone: req.body.timeZone,
        country: req.body.country,
        city: req.body.city,
        medicalCenter: req.body.medicalCenter,
        slotCollection: {
          week1: weekObj,
          week2: weekObj,
          week3: weekObj,
          week4: weekObj,
        },
        weekend: req.body.weekend,
        timming: req.body.timming,
        loggedUserID: req.body.loggedUserID,
        loggedDate: req.body.loggedDate,
      });

      await slotTemplate.save();

      return res.status(200).send({
        message: "SlotTemplate Created",
        result: slotTemplate,
      });
    }
    else {
      return res.status(400).send({
        message: "Slot Template is already exist for this Medical Center",
        result: 'Slot Template is already exist for this Medical Center',
      });
    }
  }

  async getAllSlotTemplate(req, res) {
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

    const createdAt = req.query.sort ? (req.query.sort == "desc" ? -1 : 1) : 1;

    const slotTemplate = await SlotTemplateModal.find({}).select('-slotCollection')

    console.log('Slot Template ------->', slotTemplate);

    // console.log('');

    res.status(200).send({
      status: true,
      slotTemplate: slotTemplate,
    });
  }

  async getOneSlotTemplate(req, res) {
    let slotTemplateId = req.params.id;
    let slotTemplate = await SlotTemplateModal.findById(slotTemplateId).lean();
    if (!slotTemplate) {
      return res.status(404).send({ message: "slotTemplate  doesnt exist" });
    }

    res.status(200).send({
      status: true,
      slotTemplate: slotTemplate,
    });
  }

  async getOneSlotTemplateAndRemove(req, res) {
    let slotTemplateId = req.params.id;
    let slotTemplate = await SlotTemplateModal.findByIdAndRemove(
      slotTemplateId
    );
    let status = false;
    if (slotTemplate) {
      status = true;
    }
    res.status(200).send({
      status: status,
      slotTemplate: slotTemplate,
    });
  }

  async getOneSlotTemplateAndUpdate(req, res) {
    let slotTemplateId = req.params.id;
    let slotTemplate = await SlotTemplateModal.findById(slotTemplateId);
    if (!slotTemplate) {
      return res.status(404).send({ message: "slotTemplate doesnt exist" });
    }

    let { error } = validate.validateUpdateSlotTemplate(req.body);
    if (error) {
      return res.status(400).send({
        message: "failed",
        result: error,
      });
    }

    slotTemplate.set(req.body);

    await slotTemplate.save();

    res.status(200).send({
      status: true,
      slotTemplate: slotTemplate,
    });
  }

  async publishSlotTemplate(req, res) {
    // throw new Error("could not create a user")
    let { error } = validate.publishTempate(req.body);
    if (error) {
      return res.status(400).send({
        message: "failed",
        result: error,
      });
    }

    let fromDate = req.body.fromDate;
    let { err } = validate.validateSlotTemplateFromDate(fromDate);
    if (err) {
      return res.status(400).send({
        message: "failed",
        result: err,
      });
    }

    let slotTemplateId = req.body.templateId;
    let slotTemplate = await SlotTemplateModal.findById(slotTemplateId).lean();
    if (!slotTemplate) {
      return res.status(404).send({ message: "slotTemplate  doesnt exist" });
    }

    if (slotTemplate.isPublished == true) {
      let fromdate = moment(req.body.fromDate)
      let lastdate = moment(slotTemplate.lastDate)
      if (fromdate.isBefore(lastdate)) {
        return res.status(400).send({ message: "from date cant be before last published date" });
      }
    }

    let city = slotTemplate.city;
    let slotCollection = slotTemplate.slotCollection;
    let holidays = await Holiday.find({ city: city });

    let distinctSortedHoliday = [...new Set(holidays.map((x) => x.date))].sort(
      function (a, b) {
        return new Date(a) - new Date(b);
      }
    );
    let dayCount = 1;
    let slotGroupArray = [];
    let slots2DArray = [];

    for (const weekKey in slotCollection) {
      if (slotCollection.hasOwnProperty(weekKey) && weekKey.includes('week')) {
        let week = slotCollection[weekKey];
        console.log(weekKey);

        for (const daykey in week) {
          if (week.hasOwnProperty(daykey)) {
            let day = week[daykey];
            let currentDate = moment(fromDate)
              .day(dayCount)
              .format("YYYY-MM-DD");
            // console.log(moment(fromDate).day(dayCount).format('dddd'));
            let weekName = moment(fromDate).day(dayCount).format('dddd').toLowerCase()
            let weekendArray = slotTemplate.weekend

            if (!weekendArray.includes(weekName)) {
              let slotGroup = {
                country: slotTemplate.country,
                city: slotTemplate.city,
                timeZone: slotTemplate.timeZone,
                medicalCenter: slotTemplate.medicalCenter,
                // loggedUserID:"",   //when authentication is completed
                templateId: slotTemplateId,
                date: new Date(currentDate),
                isPublished: true,
              };

              day = day.map((x) => {
                delete x._id;
                x.templateId = slotTemplateId;
                x.date = new Date(currentDate);
                return x;
              });
              // console.log(day);

              // not pushing data when its weekend (length>0) and and no other holiday inclines
              if (
                day.length > 0 &&
                !distinctSortedHoliday.includes(currentDate)
              ) {
                slotGroupArray.push(slotGroup);
                slots2DArray.push(day);
              }
            }


            dayCount++;
          }
        }
      }
    }

    // console.log(slotGroupArray);
    // console.log(slots2dArray);

    let slotGroupIds = await SlotGroup.insertMany(slotGroupArray);
    // console.log(slotGroupIds);

    let slotArray = [];
    for (let index = 0; index < slotGroupIds.length; index++) {
      const element = slotGroupIds[index];
      let temp = slots2DArray[index].map((x) => {
        x.slotGroup = element._id;
        return x;
      });
      slotArray.push(...temp);
    }
    slotArray = slotArray.map(x => {
      if (x.availableLimit == 0) {
        x.isAvailable = false
      }
      x.serviceCategory.reasonForAppointment = x.serviceCategory.reasonForAppointment[0]
      return x
    })

    console.log(slotArray.map(x => x.serviceCategory.reasonForAppointment));

    let slots = await Slot.insertMany(slotArray);
    // console.log(slots);
    // let lastdate = slotArray[slotArray.length - 1].date
    let Template = await SlotTemplateModal.findById(slotTemplateId)
    await Template.set({
      isPublished: true,
      lastDate: req.body.lastDate
    })

    await Template.save()

    return res.status(200).send({
      status: true,
      message: "template is published",
    });
  }

  async getAllReasonAndAction(req, res) {
    const action = await ActionMaster.find({});
    const reason = await ReasonMaster.find({});

    console.log("Action in Api --------->", action);
    console.log("Reason in api --------->", reason);

    let reasonAndAction = [];

    action.forEach((item) => {
      reason.forEach((element) => {
        console.log("element ------->", element);

        if (
          item.actionName == "Collection" &&
          element.reasonName == "Referral – X-Ray"
        ) {
          reasonAndAction.push({
            actionid: item._id,
            actionName: [item.actionName],
            reasonId: element._id,
            reasonName: [element.reasonName],
          });
        } else if (
          item.actionName == "Collection" &&
          element.reasonName ==
          "Referral – Confirmatory Blood Test or Speciality Consultation"
        ) {
          reasonAndAction.push({
            actionid: item._id,
            actionName: [item.actionName],
            reasonId: element._id,
            reasonName: [element.reasonName],
          });
        } else if (
          item.actionName == "Submission" &&
          element.reasonName == "Referral – Speciality Consultation"
        ) {
          reasonAndAction.push({
            actionid: item._id,
            actionName: [item.actionName],
            reasonId: element._id,
            reasonName: [element.reasonName],
          });
        } else if (
          item.actionName == "Submission" &&
          element.reasonName == "Referral – Confirmatory Blood Test"
        ) {
          reasonAndAction.push({
            actionid: item._id,
            actionName: [item.actionName],
            reasonId: element._id,
            reasonName: [element.reasonName],
          });
        } else if (
          item.actionName == "Submission" &&
          element.reasonName == "Referral – Retake"
        ) {
          reasonAndAction.push({
            actionid: item._id,
            actionName: [item.actionName],
            reasonId: element._id,
            reasonName: [element.reasonName],
          });
        } else if (
          item.actionName == "Any" &&
          element.reasonName == "Multiple"
        ) {
          reasonAndAction.push({
            actionid: item._id,
            actionName: [item.actionName],
            reasonId: element._id,
            reasonName: [element.reasonName],
          });
        }
      });
    });

    console.log("Element -------->", reasonAndAction);

    res.status(200).send({
      status: true,
      reasonAndAction: reasonAndAction,
    });
  }

  async copyPreviousDay(req, res) {
    let slotTemplateId = req.params.id;
    let slotTemplate = await SlotTemplateModal.findById(slotTemplateId);
    if (!slotTemplate) {
      return res.status(404).send({ message: "slotTemplate doesnt exist" });
    }

    let { error } = validate.copyPreviousDayValidate(req.body);
    if (error) {
      return res.status(400).send({
        message: "failed",
        result: error,
      });
    }
    let currentDay = req.body.currentDay
    let previousDay = req.body.previousDay
    let previousDaySlot = slotTemplate.slotCollection[previousDay.weekno][previousDay.slotname]

    let obj = {
      slotCollection: {}
    }
    obj.slotCollection[currentDay.weekno] = {}
    obj.slotCollection[currentDay.weekno][currentDay.slotname] = previousDaySlot
    console.log(obj);


    slotTemplate.set(obj);

    await slotTemplate.save();

    res.status(200).send({
      status: true,
      slotTemplate: slotTemplate,
    });
  }

  async copyPreviousWeek(req, res) {
    let slotTemplateId = req.params.id;
    let slotTemplate = await SlotTemplateModal.findById(slotTemplateId);
    if (!slotTemplate) {
      return res.status(404).send({ message: "slotTemplate doesnt exist" });
    }

    let { error } = validate.copyPreviousWeekValidate(req.body);
    if (error) {
      return res.status(400).send({
        message: "failed",
        result: error,
      });
    }
    let currentWeek = req.body.currentWeekno
    let previousWeek = req.body.previousWeekno
    let previousWeekSlot = slotTemplate.slotCollection[previousWeek]

    let obj = {
      slotCollection: {}
    }
    obj.slotCollection[currentWeek] = previousWeekSlot

    slotTemplate.set(obj);

    await slotTemplate.save();

    res.status(200).send({
      status: true,
      slotTemplate: slotTemplate,
    });
  }

  async deleteAllSlotTemplateData(req, res) {

    let templateId = req.params.id

    let status = false

    let slotsData = await Slot.find({ templateId: templateId })

    console.log('Slots Data ------->', slotsData);

    let slotsIds = []

    slotsData.forEach(item => {
      slotsIds.push(item._id)
    })

    let appointmentData = await Appointments.find({ slotId: { $in: slotsIds } })

    let appointmentAuditData = await AppointmentAudits.find({ slotId: { $in: slotsIds } })

    let appointmentIds = []
    let appointmentAuditIds = []

    appointmentData.forEach(item => {
      appointmentIds.push(item._id)
    })

    appointmentAuditData.forEach(item => {
      appointmentAuditIds.push(item._id)
    })

    let deleteAppointmentData = await Appointments.remove({ _id: { $in: appointmentIds } })

    let deleteAppointmentAuditData = await AppointmentAudits.remove({ _id: { $in: appointmentIds } })

    let deleteSlots = await Slot.remove({ _id: { $in: slotsIds } })


    res.status(200).send({
      status: true,
      deleteAppointmentData: deleteAppointmentData,
      deleteAppointmentAuditData: deleteAppointmentAuditData,
      deleteSlots: deleteSlots
    });
  }

}

module.exports = SlotTemplate;
