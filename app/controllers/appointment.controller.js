const appArrayData = require("../models/appointment/appt_data");
const Appointments = require("../models/appointment/Appointment");
const Slots = require("../models/appointment/Slot");
const slotsGroup = require("../models/appointment/SlotGroup")
const AppointmentAudits = require("../models/appointment/AppointmentAudit");
const reasonAppointment = require("../models/appointment/ReasonMaster");
let pdf = require("html-pdf");
const EmailTemplate = require('./email.controller')
let email = new EmailTemplate()
const SmsTemplate = require('./smsTemplate.controller')
const CountryModal = require('../models/master/Country')
const CityModal = require('../models/master/City')
const MedicalCenterModal = require("../models/master/MedicalCenter");
let ejs = require("ejs");
let path = require("path");
let sms = new SmsTemplate()
const validate = require("../validators/appointment.validator");
const UserDetail = require("./userDetail.controller");
const { Logform } = require("winston");
const sendSms = require('../helpers/sms')


const axios = require("axios");
const GlosysUrl = process.env.GLOSYS_LINK;
const moment = require("moment");
const fs = require('fs');
const SlotGroup = require("../models/appointment/SlotGroup");
const AppointmentAudit = require("../models/appointment/AppointmentAudit");
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const headers = {
  "Content-Type": "application/json",
  "X-CSRF-TOKEN": process.env.GLOSYS_X_CSRF_TOKEN,
  "X-USER-SITE": process.env.GLOSYS_X_USER_SITE,
};

class Appointment {
  /**
   * @function - Get all the registered users from the db
   *
   * @param - Express.req , Express.res
   *
   * @returns - List of registered users
   */

  async createAppointment(req, res) {


    if (req.body.visa_ref_no !== req.user.userDetail.visaApplicationNumber) {
      return res.status(403).send({ message: "Forbbiden. Not allowed to create this appointment" });
    }
    let { error } = validate.validateAppointment(req.body);
    if (error) {
      return res.status(400).send({
        message: "failed please retry again",
        result: error,
      });
    }
    let slot = await Slots.findById(req.body.slotId);
    if (slot == null) {
      return res.status(400).send({
        message: "slot does not exist",
        slot: slot,
      });
    }
    if (slot.availableLimit <= slot.consumedCount) {
      return res.status(400).send({
        message: "slot does not available its completely booked",
        slot: slot,
      });
    }

    if (!slot.isAvailable) {
      return res.status(400).send({
        message: "slot does not available",
        slot: slot,
      });
    }

    let appointment = new Appointments({
      visa_ref_no: req.body.visa_ref_no,
      passport_no: req.body.passport_no,
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      callCenter: req.body.callCenter,
      gender: req.body.gender,
      date_of_birth: req.body.date_of_birth,
      appointmentDate: req.body.appointmentDate,
      country: req.body.country,
      city: req.body.city,
      medicalCenter: req.body.medicalCenter,
      appt_reason: req.body.appt_reason,
      actionRequired: req.body.actionRequired,
      referralDetails: req.body.referralDetails,
      slotId: req.body.slotId,
      callCenter: req.body.callCenter ? true : false
    });

    let slotCount = slot.consumedCount;

    await appointment.save();
    await slot.set({ consumedCount: slotCount + 1 });
    await slot.save();

    try {


      // for (const iterator of req.body.referralDetails) {
      let postData = {
        visaApplicantNumber: req.body.visa_ref_no,
        passportNumber:
          req.body.passport_no == "null" ? "" : req.body.passport_no,
        action: "book",
        appointmentList: [],
      };
      for (const iterator of req.body.referralDetails) {
        postData.appointmentList.push({

          referralId: iterator.Referralid.toString(),
          referral: iterator.Referral,
          appointmentDate: moment(slot.date).format("DD-MM-YYYY"),
          timeSlot: slot.starttime,
          appointmentReferenceNumber: appointment._id.toString(),
        })
      }
      let { data } = await axios.post(
        GlosysUrl + "postAppointmentDetails",
        postData,
        { headers: headers }
      );


      if (!data.message.includes("Appointment Booked")) {
        await appointment.remove();
        await slot.set({ consumedCount: slotCount });
        await slot.save();

        return res.status(400).send({
          message: data.message,
          status: false,
        });
      }
      // }


    } catch (error) {

      await appointment.remove();
      await slot.set({ consumedCount: slotCount });
      await slot.save();
      console.log(postData);

      return res.status(400).send({
        message: error,
        status: false,
      });
    }
    // async email function dont need to  wait for confirmation of success
    email.BookingAndRescheduleMail(appointment._id, "appointment confirmation")
      .then(x => { console.log("email mail sent 📩 ") })
      .catch(err => {
        console.log("email not sent ");
        console.error(err);
      });

    sms.BookingAndRescheduleSms(appointment, "appointment confirmation")
      .then(x => { console.log("sms sent") })
      .catch(err => {
        console.log("sms not sent ");
        console.error(err);
      });

    return res.status(200).send({
      message: "Appointment Created",
      result: appointment,
    });
  }

  async getAllAppointment(req, res) {
    let { error } = validate.validateQueryAppointment(req.query);
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

    const createdAt = req.query.sort ? (req.query.sort == "desc" ? -1 : 1) : 1;
    if (req.query.sort) delete req.query.sort;

    const appointment = await Appointments.find(req.query).populate("slotId")
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: createdAt })
      .lean();

    res.status(200).send({
      status: true,
      appointment: appointment,
    });
  }

  async getOneAppointment(req, res) {
    let appointmentId = req.params.id;
    let appointment = await Appointments.findById(appointmentId).lean();
    if (!appointment) {
      return res.status(404).send({ message: "appointment  doesnt exist" });
    }

    res.status(200).send({
      status: true,
      appointment: appointment,
    });
  }

  async getOneAppointmentAndRemove(req, res) {
    let appointmentId = req.params.id;
    let appointment = await Appointments.findByIdAndRemove(appointmentId);
    let status = false;
    if (appointment) {
      status = true;
    }
    res.status(200).send({
      status: status,
      appointment: appointment,
    });
  }

  async getOneAppointmentAndCancel(req, res) {

    console.log('Req body user ------>', req.user);

    let appointmentId = req.params.id;
    let appointment = await Appointments.findById(appointmentId).populate('slotId');
    if (!appointment) {
      return res.status(404).send({ message: "appointment doesnt exist" });
    }
    // console.log(req.user);

    if (req.user.hasOwnProperty('userDetail')) {
      if (!(appointment.visa_ref_no == req.user.userDetail.visaApplicationNumber)) {
        return res.status(403).send({ message: "Forbbiden. Not allowed to cancel this appointment" });
      }
    }
    else {
      if (!(req.user.isAdmin)) {
        return res.status(403).send({ message: "Forbbiden. Not allowed to cancel this appointment" });
      }
    }


    appointment.set({ status: "cancelled" });
    await appointment.save();

    let perviousSlot = await Slots.findById(appointment.slotId);
    let count = perviousSlot.consumedCount;
    count = count - 1;
    perviousSlot.consumedCount = count;

    let appointmentAudit = new AppointmentAudits({
      visa_ref_no: appointment.visa_ref_no,
      passport_no: appointment.passport_no,
      fullName: appointment.fullName,
      email: appointment.email,
      phone: appointment.phone,
      gender: appointment.gender,
      date_of_birth: appointment.date_of_birth,
      appointmentDate: appointment.appointmentDate,
      country: appointment.country,
      city: appointment.city,
      medicalCenter: appointment.medicalCenter,
      appt_reason: appointment.appt_reason,
      actionRequired: appointment.actionRequired,
      referralDetails: appointment.referralDetails,
      appointmentId: appointment._id,
      slotId: appointment.slotId,
      status: appointment.status,
      appointmentCreated: appointment.createdAt,
      appointmentUpdated: appointment.updatedAt,
    });



    try {


      // for (const iterator of appointment.referralDetails) {
      let postData = {
        visaApplicantNumber: appointment.visa_ref_no,
        passportNumber:
          appointment.passport_no == "null" ? "" : req.body.passport_no,
        action: "cancel",
        appointmentList: [],
        // referralId: iterator.Referralid.toString(),
        // referral: iterator.Referral,
        // appointmentDate: moment(appointment.appointmentDate).format("DD-MM-YYYY"),
        // timeSlot: perviousSlot.starttime.split(":").join("."),
        // appointmentReferenceNumber: appointment._id.toString(),

      };
      for (const iterator of appointment.referralDetails) {
        postData.appointmentList.push({
          referralId: iterator.Referralid.toString(),
          referral: iterator.Referral,
          appointmentDate: moment(appointment.appointmentDate).format("DD-MM-YYYY"),
          timeSlot: perviousSlot.starttime,
          appointmentReferenceNumber: appointment._id.toString(),
        })
      }
      let { data } = await axios.post(
        GlosysUrl + "postAppointmentDetails",
        postData,
        { headers: headers }
      );
      //  }

      if (data.message.includes("Appointment Cancelled")) {

        email.CancelAndMissedMail(appointment, "appointment cancellation")
          .then(x => { console.log("email mail sent") })
          .catch(err => {
            console.log("email not sent ");
            console.error(err);
          });
        sms.CancelAndMissedSms(appointment, "appointment cancellation")
          .then(x => { console.log("sms mail sent") })
          .catch(err => {
            console.log("sms not sent ");
            console.error(err);
          });
        await appointmentAudit.save();
        await appointment.remove();
        await perviousSlot.save();

        res.status(200).send({
          status: true,
          message: "appointment cancelled and moved to audit",
          appointment: appointment,
          appointmentAudit: appointmentAudit,
        });
      } else {
        res.status(500).send({ message: data.message });
      }
    } catch (error) {
      res.status(500).send({ message: "glosys cancel appointment api failed" });
      console.log(error);

    }
  }

  async getOneAppointmentAndComplete(req, res) {
    let appointmentId = req.params.id;
    let appointment = await Appointments.findById(appointmentId);
    if (!appointment) {
      return res.status(404).send({ message: "appointment doesnt exist" });
    }

    appointment.set({ status: "completed" });
    await appointment.save();

    let appointmentAudit = new AppointmentAudits({
      visa_ref_no: appointment.visa_ref_no,
      passport_no: appointment.passport_no,
      fullName: appointment.fullName,
      gender: appointment.gender,
      phone: appointment.phone,
      email: appointment.email,
      date_of_birth: appointment.date_of_birth,
      appointmentDate: appointment.appointmentDate,
      country: appointment.country,
      city: appointment.city,
      medicalCenter: appointment.medicalCenter,
      appt_reason: appointment.appt_reason,
      actionRequired: appointment.actionRequired,
      referralDetails: appointment.referralDetails,
      appointmentId: appointment._id,
      slotId: appointment.slotId,
      status: appointment.status,
      appointmentCreated: appointment.createdAt,
      appointmentUpdated: appointment.updatedAt,
    });




    await appointmentAudit.save();
    await appointment.remove();

    res.status(200).send({
      status: true,
      message: "appointment completed and moved to audit",

    });
  }

  async getOneAppointmentAndAbsent(req, res) {
    let appointmentId = req.params.id;
    let appointment = await Appointments.findById(appointmentId);
    if (!appointment) {
      return res.status(404).send({ message: "appointment doesnt exist" });
    }

    appointment.set({ status: "absent" });
    await appointment.save();

    let appointmentAudit = new AppointmentAudits({
      visa_ref_no: appointment.visa_ref_no,
      passport_no: appointment.passport_no,
      fullName: appointment.fullName,
      gender: appointment.gender,
      date_of_birth: appointment.date_of_birth,
      appointmentDate: appointment.appointmentDate,
      country: appointment.country,
      city: appointment.city,
      medicalCenter: appointment.medicalCenter,
      appt_reason: appointment.appt_reason,
      actionRequired: appointment.actionRequired,
      referralDetails: appointment.referralDetails,
      appointmentId: appointment._id,
      slotId: appointment.slotId,
      status: appointment.status,
      appointmentCreated: appointment.createdAt,
      appointmentUpdated: appointment.updatedAt,
    });

    let appoint = appointment
    email.CancelAndMissedMail(appoint, "appointment missed")
      .then(x => { console.log("email mail sent") })
      .catch(err => {
        console.log("email not sent ");
        console.error(err);
      });

    sms.CancelAndMissedSms(appoint, "appointment missed")
      .then(x => { console.log("sms mail sent") })
      .catch(err => {
        console.log("sms not sent ");
        console.error(err);
      });

    await appointmentAudit.save();
    await appointment.remove();

    res.status(200).send({
      status: true,
      message: "appointment's status is marked absent and moved to audit",
      appointment: appointment,
      appointmentAudit: appointmentAudit,
    });
  }

  async getOneAppointmentAndReschedule(req, res) {
    console.log("body=====>❌ ", req.body);
    let appointmentId = req.params.id;

    let appointment = await Appointments.findById(appointmentId);
    if (!appointment) {
      return res.status(404).send({ message: "appointment doesnt exist" });
    }
    if (!(appointment.visa_ref_no == req.user.userDetail.visaApplicationNumber || req.user.isAdmin)) {
      return res.status(403).send({ message: "Forbbiden. Not allowed to reschedule this appointment" });
    }

    let { error } = validate.validateUpdateAppointment(req.body);
    if (error) {
      return res.status(400).send({
        message: "failed",
        result: error,
      });
    }

    let newSlot = await Slots.findById(req.body.slotId);
    if (newSlot == null) {
      return res.status(400).send({
        message: "slot does not exist",
        slot: slot,
      });
    }
    if (newSlot.availableLimit <= newSlot.consumedCount) {
      return res.status(400).send({
        message: "slot does not available its completely booked",
      });
    }
    let newcount = newSlot.consumedCount;
    newcount = newcount + 1;
    newSlot.consumedCount = newcount;

    let perviousSlot = await Slots.findById(appointment.slotId);
    let count = perviousSlot.consumedCount;
    count = count - 1;
    perviousSlot.consumedCount = count;

    let appointmentAudit = new AppointmentAudits({
      visa_ref_no: appointment.visa_ref_no,
      passport_no: appointment.passport_no,
      fullName: appointment.fullName,
      email: appointment.email,
      phone: appointment.phone,
      gender: appointment.gender,
      date_of_birth: appointment.date_of_birth,
      appointmentDate: appointment.appointmentDate,
      country: appointment.country,
      city: appointment.city,
      medicalCenter: appointment.medicalCenter,
      appt_reason: appointment.appt_reason,
      actionRequired: appointment.actionRequired,
      referralDetails: appointment.referralDetails,
      appointmentId: appointment._id,
      slotId: appointment.slotId,
      status: "rescheduled",
      callCenter: appointment.callCenter ? true : false,
      appointmentCreated: appointment.createdAt,
      appointmentUpdated: appointment.updatedAt,
    });

    appointment.set(req.body);





    try {

      // for (const iterator of appointment.referralDetails) {
      let postData = {
        visaApplicantNumber: appointment.visa_ref_no,
        passportNumber:
          appointment.passport_no == "null" ? "" : req.body.passport_no,
        action: "reschedule",

        appointmentList: [],
        // referralId: iterator.Referralid.toString(),
        // referral: iterator.Referral,
        // appointmentDate: moment(appointment.appointmentDate).format("DD-MM-YYYY"),
        // timeSlot: perviousSlot.starttime.split(":").join("."),
        // appointmentReferenceNumber: appointment._id.toString(),

      };
      for (const iterator of appointment.referralDetails) {
        postData.appointmentList.push({
          referralId: iterator.Referralid.toString(),
          referral: iterator.Referral,
          appointmentDate: moment(appointment.appointmentDate).format("DD-MM-YYYY"),
          timeSlot: perviousSlot.starttime,
          appointmentReferenceNumber: appointment._id.toString(),
        })
      }
      let { data } = await axios.post(
        GlosysUrl + "postAppointmentDetails",
        postData,
        { headers: headers }
      );
      console.log(postData);
      console.log(data);
      // }

      if (data.message.includes("Appointment Rescheduled")) {
        await appointmentAudit.save();
        await appointment.save();
        await perviousSlot.save();
        await newSlot.save();

        res.status(200).send({
          status: true,
          appointment: appointment,
        });
        email.BookingAndRescheduleMail(appointment._id, "appointment rescheduled")
          .then(x => { console.log("email mail sent") })
          .catch(err => {
            console.log("email not sent ");
            console.error(err);
          });
        sms.BookingAndRescheduleSms(appointment, "appointment rescheduled")
          .then(x => { console.log("sms mail sent") })
          .catch(err => {
            console.log("sms not sent ");
            console.error(err);
          });
      } else {
        res.status(500).send({ message: data.message });
      }
    } catch (error) {
      console.log(error);

      res.status(500).send({ message: "glosys cancel appointment api failed" });
      console.log(error);

    }
  }

  async bulkCancellationOfAppointments(req, res) {
    let cancelAppointmentList = req.body.bulkCancelList;

    let data = { _id: { $in: [...cancelAppointmentList] } };

    console.log("cancelAppointmentList ------->", cancelAppointmentList);

    let slot = await Slots.updateMany(data, { $set: { isAvailable: false, consumedCount: 0 } });

    await Appointments.updateMany(
      { slotId: { $in: [...cancelAppointmentList] } },
      { $set: { status: "cancelled" } }
    );
    let appointment = await Appointments.find({
      slotId: { $in: [...cancelAppointmentList] },
    }).lean();
    let audits = appointment.map((x) => {
      x.appointmentCreated = x.createdAt;
      x.appointmentUpdated = x.updatedAt;
      x.appointmentId = x._id;
      delete x.createdAt;
      delete x.updatedAt;
      delete x._id;
      delete x.__v;
      return x;
    });
    let appointmentAudit = null;
    if (audits.length > 0) {
      appointmentAudit = await AppointmentAudits.insertMany(audits);
    }

    for (const iterator of appointment) {
      console.log(iterator);

      email.CancelAndMissedMail(iterator, "appointment cancellation")
        .then(x => { console.log("email mail sent") })
        .catch(err => {
          console.log("email not sent ");
          console.error(err);
        });
      sms.CancelAndMissedSms(iterator, "appointment cancellation")
        .then(x => { console.log("sms mail sent") })
        .catch(err => {
          console.log("sms not sent ");
          console.error(err);
        });

    }

    await Appointments.remove({ slotId: { $in: [...cancelAppointmentList] } });

    res.status(200).send({
      status: true,
      appointmentAudit: appointmentAudit,
    });
  }

  async appointmentHistory(req, res) {
    // throw new Error("could not create a user")
    if (req.body.visa_ref_no !== req.user.userDetail.visaApplicationNumber) {
      return res.status(403).send({ message: "Forbbiden. Not allowed to reschedule this appointment" });
    }
    let { error } = validate.validateAppointmentHistory(req.body);
    if (error) {
      return res.status(400).send({
        message: "failed",
        result: error,
      });
    }

    let date_of_birth = req.body.date_of_birth;
    let passport_no = req.body.passport_no;
    let visa_ref_no = req.body.visa_ref_no;
    let appointment = await Appointments.find({
      date_of_birth: date_of_birth,
      passport_no: passport_no,
      visa_ref_no: visa_ref_no,
    })
      .populate("slotId")
      .populate({ path: "actionRequired", select: "_id actionName" })
      .populate({ path: "appt_reason", select: "_id reasonName" })
      .lean().sort({ createdAt: -1 });
    let appointmentAudit = await AppointmentAudits.find({
      date_of_birth: date_of_birth,
      passport_no: passport_no,
      visa_ref_no: visa_ref_no,
    })
      .populate({ path: "slotId" })
      .populate({ path: "actionRequired", select: "_id actionName" })
      .populate({ path: "appt_reason", select: "_id reasonName" })
      .lean().sort({ createdAt: -1 });

    let appointments = appointment.concat(appointmentAudit);


    res.status(200).send({
      status: true,
      appointmentHistory: appointments,
    });
  }

  async otpVerification(req, res) {

    console.log('Contact Mobile data ------------>');

    // if (!(req.body.mobile == req.user.userDetail.contactMobile)) {
    //   console.log(req.body.mobile, req.user.userDetail.contactMobile);

    //   return res.status(403).send({ message: "Forbbiden. Not authorize" });
    // }

    console.log("req.user.userDetail.visaApplicationNumber ======>", req.user.userDetail.phone);
    let mobile = req.body.mobile;
    let receivedOtp = req.body.otp;


    try {
      let user = await Otp.findOne({
        mobile: req.body.mobile,
        otp: req.body.otp,
        status: "INIT",
      });

      let start = new Date();
      let end = user.createdAt
      let elapsed = start.getTime() - end.getTime()
      if (elapsed <= 180000) {
        if (user) {
          user.status = "Verified";
          await user.save();
          return res.status(200).send({
            status: true,
            message: user,
          });
        } else {
          return res.status(404).send({
            status: false,
            message: "User not Found",
          });
        }
      }
      else {
        return res.status(410).send({
          status: false,
          message: "OTP Expired Please Try Again"
        })
      }

    } catch (error) {
      return res.send(error);
    }
  }

  async getUpcomingAppointments(req, res) {

    let { frmDate, eDate, country, city, medical, viewType, reasonForAppointment, content } = req.body
    let fromDate = moment(new Date(frmDate)).format('YYYY-MM-DD').toString()
    let toDate = moment(new Date(eDate)).format('YYYY-MM-DD').toString()

    let filter = {}
    console.log("frmDate❌ ", fromDate);
    console.log("eDate ❌ ", toDate);

    if (country.length > 0) {
      filter['country.countryId'] = country.toString()
    }

    if (city.length > 0) {
      filter['city.cityId'] = { $in: city }
    }

    if (medical.length > 0) {
      filter['medicalCenter.medicalCenterId'] = { $in: medical }
    }
    if (reasonForAppointment.length > 0) {
      filter['appt_reason'] = { $in: reasonForAppointment }
    }
    if (content.length > 0) {
      filter['status'] = { $in: content }
    }

    let slotFilter = {}

    let filterObj = {}

    if (country.length > 0) {
      slotFilter['country.countryId'] = { $in: country }
    }

    if (city.length > 0) {
      slotFilter['city.cityId'] = { $in: city }
    }

    if (medical.length > 0) {
      slotFilter['medicalCenter.medicalCenterId'] = { $in: medical }
    }

    if (reasonForAppointment.length > 0) {
      filterObj['serviceCategory.reasonForAppointment'] = { $in: reasonForAppointment }
    }


    let totalSlots = await SlotGroup.find({ ...slotFilter, date: { $gte: fromDate, $lte: toDate } })

    let slots = []

    if (totalSlots.length > 0) {
      let groupData = []

      totalSlots.forEach(item => {
        groupData.push(item._id)
      })

      let groupId = { $in: groupData }

      slots = await Slots.find({ ...filterObj, slotGroup: groupId })
    }

    console.log('Slots cOUNT --->', slots.length);

    let totalUsedSlots = 0
    let totalAvailableSlots = 0

    slots.filter(element => {

      if (element.availableLimit > 0 && element.isAvailable) {
        totalAvailableSlots = totalAvailableSlots + 1
      }
      if (element.consumedCount > 0 && element.isAvailable) {
        totalUsedSlots = totalUsedSlots + 1
      }
    })


    let vacantSlots = totalAvailableSlots - totalUsedSlots

    let dataSlots = {
      datasets: [
        {
          data: [totalUsedSlots, vacantSlots],
          backgroundColor: ['#ff1a1a',
            '#3366ff',
          ]
        }
      ],
      labels: [
        'Allocate',
        'Vacant',
      ]
    }


    let upcomingAppointments = await Appointments.find({ ...filter, appointmentDate: { $gte: fromDate, $lte: toDate } }).populate('appt_reason');
    let upcomingAppointmentAudits = await AppointmentAudits.find({ ...filter, appointmentDate: { $gte: fromDate, $lte: toDate } }).populate('appt_reason')

    let overAllAppointments = upcomingAppointments.concat(upcomingAppointmentAudits);
    console.log("overallappointment====>", overAllAppointments);
    let bookedCount = 0
    let rescheduleCount = 0
    let cancelledCount = 0
    let absentCount = 0


    overAllAppointments.forEach(item => {
      if (item.status == 'booked') {
        bookedCount = bookedCount + 1
      }
      if (item.status == 'rescheduled') {
        rescheduleCount = rescheduleCount + 1
      }
      if (item.status == 'cancelled') {
        cancelledCount = cancelledCount + 1
      }
      if (item.status == 'absent') {
        absentCount = absentCount + 1
      }
    })


    let totalBookAppointment = bookedCount + rescheduleCount + cancelledCount + absentCount
    console.log("totalBookAppointment====>", totalBookAppointment);

    let data = {
      datasets: [
        {
          data: [totalBookAppointment, bookedCount, rescheduleCount, cancelledCount, absentCount],
          backgroundColor: ['#ff9999', '#ff1a75',
            '#ffa64d',
            '#66ff66', '#3385ff']
        }
      ],
      labels: [
        'Total Appointment',
        'Booked',
        'Reschedule',
        'Cancelled',
        'Absent'
      ]
    }

    res.status(200).send({
      upComingAppointment: overAllAppointments,
      data: data,
      totalBookAppointment: totalBookAppointment,
      slotsData: dataSlots,
      totalSlots: totalAvailableSlots
    });


  }

  async getUpcomingAppointmentChartData(req, res) {

    let { frmDate, eDate, country, city, medical, viewType, reasonForAppointment, content } = req.body
    let fromDate = moment(new Date(frmDate)).format('YYYY-MM-DD').toString()
    let toDate = moment(new Date(eDate)).format('YYYY-MM-DD').toString()

    let slotFilter = {}
    let filter = {}

    if (country.length > 0) {
      slotFilter['country.countryId'] = { $in: country }
    }

    if (city.length > 0) {
      slotFilter['city.cityId'] = { $in: city }
    }

    if (medical.length > 0) {
      slotFilter['medicalCenter.medicalCenterId'] = { $in: medical }
    }


    let totalSlots = await SlotGroup.find({ ...slotFilter, date: { $gte: fromDate, $lte: toDate } }).populate('slots')


    let totalUsedSlots = 0
    let totalAvailableSlots = 0

    totalSlots.forEach(item => {
      item.slots.filter(element => {

        if (element.availableLimit > 0 && element.isAvailable) {
          totalAvailableSlots = totalAvailableSlots + 1
        }
        if (element.consumedCount > 0 && element.isAvailable) {
          totalUsedSlots = totalUsedSlots + 1
        }
      })
    })


    let vacantSlots = totalAvailableSlots - totalUsedSlots

    let dataSlots = {
      datasets: [
        {
          data: [totalUsedSlots, vacantSlots],
          backgroundColor: ['#ff1a1a',
            '#3366ff',
          ]
        }
      ],
      labels: [
        'Allocate',
        'Vacant',
      ]
    }

    res.status(200).send({
      slotsData: dataSlots,
      totalSlots: totalAvailableSlots
      // totalSlots: totalSlots
    });

  }

  async getUpcomingAppointmentBarChartData(req, res) {

    let { frmDate, eDate, country, city, medical, viewType, reasonForAppointment, content } = req.body
    let fromDate = moment(new Date(frmDate)).format('YYYY-MM-DD').toString()
    let toDate = moment(new Date(eDate)).format('YYYY-MM-DD').toString()


    let bargraphLabels = []

    var listDate = [];

    if (viewType == 'daily') {

      listDate = []

      var startDate = fromDate;
      var endDate = toDate;
      var dateMove = new Date(startDate);
      var strDate = startDate;

      let startNewDate = new Date(startDate);
      let endNewDate = new Date(endDate)

      // var diffDays = endNewDate.getDate() - startNewDate.getDate();
      // // console.log('Difference days ------->', diffDays);

      let diffTime1 = Math.abs(endNewDate - startNewDate);
      let diffDays = Math.ceil(diffTime1 / (1000 * 60 * 60 * 24));



      if (diffDays > 0) {
        while (strDate < endDate) {
          var strDate = dateMove.toISOString().slice(0, 10);
          listDate.push(strDate);
          dateMove.setDate(dateMove.getDate() + 1);
        };
      }
      else {
        listDate.push(strDate)
      }

      if (listDate.length > 0) {
        bargraphLabels = listDate
      }
      else {
        bargraphLabels = fromDate
      }
    }
    if (viewType == 'weekly') {

      listDate = []

      let firstWeekDay = moment(new Date(frmDate), "MM-DD-YYYY").week();
      let lastWeekDay = moment(new Date(eDate), "MM-DD-YYYY").week();

      console.log('First Week Day ------>', firstWeekDay);
      console.log('lastWeekDay Day ------>', lastWeekDay);


      let weekDiff = lastWeekDay - firstWeekDay

      console.log('Week Diff --------->', weekDiff);

      if (weekDiff >= 0) {
        for (let i = firstWeekDay - 1; i < lastWeekDay - 1; i++) {

          let firstDate = moment().day("Monday").isoWeek(i).format('YYYY-MM-DD')
          let lasttDate = moment().day("Sunday").isoWeek(i).format('YYYY-MM-DD')

          bargraphLabels.push(`${firstDate}  - ${lasttDate}`)
          listDate.push(i)
        }

      }
      // else {

      //   let endofYear = ''

      //   if (lastWeekDay < 52) {
      //     endofYear = 52
      //   }

      //   let bargraphLabels1 = []
      //   let listDate1 = []
      //   let bargraphLabels2 = []
      //   let listDate2 = []

      //   for (let i = firstWeekDay; i <= endofYear; i++) {
      //     let firstDate = moment().day("Monday").isoWeek(i).format('YYYY-MM-DD')
      //     let lasttDate = moment().day("Sunday").isoWeek(i).format('YYYY-MM-DD')

      //     bargraphLabels1.push(`${firstDate}  - ${lasttDate}`)
      //     listDate1.push(i - 1)
      //   }


      //   var firtWeek = moment().day("Monday").week(endofYear).add(7, 'days').format('YYYY-MM-DD');
      //   var lastWeek = moment(new Date(firtWeek)).day("Sunday").add((lastWeekDay - 1), 'weeks').format('YYYY-MM-DD');



      //   let firstWeekNextYear = moment(new Date(firtWeek), "MM-DD-YYYY").week();
      //   let lastWeekLastYear = moment(new Date(lastWeek), "MM-DD-YYYY").week();


      //   for (let i = firstWeekNextYear; i <= lastWeekLastYear; i++) {
      //     let firstDate = moment().add(1, 'year').day("Monday").isoWeek(i - 1).format('YYYY-MM-DD')
      //     let lasttDate = moment().add(1, 'year').day("Sunday").isoWeek(i - 1).format('YYYY-MM-DD')

      //     bargraphLabels2.push(`${firstDate}  - ${lasttDate}`)
      //     listDate2.push(i)
      //   }

      //   bargraphLabels = bargraphLabels1.concat(bargraphLabels2)
      //   listDate = listDate1.concat(listDate2)


      // }


    }
    if (viewType == 'monthly') {

      listDate = []

      let firstMonth = moment(new Date(frmDate)).format('M');
      let lastMonth = moment(new Date(eDate)).format('M');

      let monthDiff = lastMonth - firstMonth

      console.log('Month Diff ------>', monthDiff);


      if (monthDiff >= 0) {
        for (let i = firstMonth; i <= lastMonth; i++) {
          listDate.push(Number(i))
          bargraphLabels.push(moment(i, 'M').format('MMMM'))
        }
      }
      else {
        let endofYearMonth = ''

        if (lastMonth < 12) {
          endofYearMonth = 12
        }

        let bargraphLabels1 = []
        let listDate1 = []
        let bargraphLabels2 = []
        let listDate2 = []

        for (let i = firstMonth; i <= endofYearMonth; i++) {
          listDate1.push(Number(i))
          bargraphLabels1.push(moment(i, 'M').format('MMMM'))
        }

        let lastDateOfYear = ''

        let getFullDate = moment(new Date(frmDate)).format('YYYY-MM-DD')


        let getYear = getFullDate.split('-')[0];

        let newYear = parseInt(getYear) + 1

        let makelastDate = `${newYear}-01-01`


        var firtMonthNewYear = moment(makelastDate).format('M');
        var lastMonthNewYear = moment(firtMonthNewYear).add(lastMonth - 1, 'M').format('M');

        for (let i = firtMonthNewYear; i <= lastMonthNewYear; i++) {

          listDate2.push(Number(i))
          bargraphLabels2.push(moment(i, 'M').format('MMMM'))
        }

        bargraphLabels = bargraphLabels1.concat(bargraphLabels2)
        listDate = listDate1.concat(listDate2)

      }

    }

    let filter = {}

    if (country.length > 0) {
      filter['country.countryId'] = country.toString()
    }

    if (city.length > 0) {
      filter['city.cityId'] = { $in: city }
    }

    if (medical.length > 0) {
      filter['medicalCenter.medicalCenterId'] = { $in: medical }
    }

    if (content.length > 0) {
      filter['status'] = { $in: content }
    }

    let reasonId = []

    if (reasonForAppointment.length > 0) {
      let reasonData = reasonForAppointment

      reasonId = reasonData.map(id => mongoose.Types.ObjectId(id));

      filter['appt_reason'] = { $in: reasonId }
    }


    let appointments = []
    let totalCapacity = []


    let finalObj = {}

    // if (viewType == 'daily' || viewType == 'weekly' || viewType == 'monthly') {


    finalObj = {
      rescheduled: {},
      booked: {},
      cancelled: {},
      absent: {}
    }

    let reasonOfAppointment = await reasonAppointment.find({})

    reasonOfAppointment.forEach(item => {
      finalObj['booked'][item.reasonName] = []
      finalObj['cancelled'][item.reasonName] = []
      finalObj['rescheduled'][item.reasonName] = []
      finalObj['absent'][item.reasonName] = []
    })

    reasonOfAppointment.forEach(item => {
      finalObj['booked'][item.reasonName] = Array(listDate.length).fill(0)
      finalObj['cancelled'][item.reasonName] = Array(listDate.length).fill(0)
      finalObj['rescheduled'][item.reasonName] = Array(listDate.length).fill(0)
      finalObj['absent'][item.reasonName] = Array(listDate.length).fill(0)
    })

    // }

    // console.log('Final Obj ------>', finalObj);


    if (viewType == 'daily') {

      appointments = await Appointments.aggregate([
        {
          $lookup: {
            from: "reasonrequireds",
            localField: "appt_reason",
            foreignField: "_id",
            as: "reasonrequireds"
          }
        },
        { $unwind: "$reasonrequireds" },
        { $match: { ...filter, "appointmentDate": { $gte: new Date(fromDate), $lte: new Date(toDate) } } },
        {
          "$project": {
            "createdAtWeek": { "$week": "$appointmentDate" },
            "createdAtMonth": { "$month": "$appointmentDate" },
            date: "$appointmentDate",
            reasonName: "$reasonrequireds.reasonName",
            status: "$status"
          }
        },
        {
          $group: {
            _id: {
              date: '$date',
              referal: '$reasonName',
              status: '$status',
            },
            totalappointment: { $sum: 1 },
          }
        },
        { $sort: { "_id.date": 1 } }
      ])

      let appointmentAudits = await AppointmentAudits.aggregate([
        {
          $lookup: {
            from: "reasonrequireds",
            localField: "appt_reason",
            foreignField: "_id",
            as: "reasonrequireds"
          }
        },
        { $unwind: "$reasonrequireds" },
        { $match: { ...filter, "appointmentDate": { $gte: new Date(fromDate), $lte: new Date(toDate) } } },
        {
          "$project": {
            "createdAtWeek": { "$week": "$appointmentDate" },
            "createdAtMonth": { "$month": "$appointmentDate" },
            date: "$appointmentDate",
            reasonName: "$reasonrequireds.reasonName",
            status: "$status"
          }
        },
        {
          $group: {
            _id: {
              date: '$date',
              referal: '$reasonName',
              status: '$status',
            },
            totalappointment: { $sum: 1 },
          }
        },
        { $sort: { "_id.date": 1 } }
      ])

      let overAllAppointments = appointments.concat(appointmentAudits)

      overAllAppointments.forEach(async (item) => {

        let appt_date = moment(item._id.date).format('YYYY-MM-DD').toString()

        let dateIndex = listDate.indexOf(appt_date)
        if (dateIndex != -1) {

          console.log('Status --------->', item._id.status);

          // let status_referal = `${item._id.referal}_${item._id.status}`
          finalObj[item._id.status][item._id.referal][dateIndex] = item.totalappointment

        }

      })

    }
    else if (viewType == 'weekly') {
      appointments = await Appointments.aggregate([
        {
          $lookup: {
            from: "reasonrequireds",
            localField: "appt_reason",
            foreignField: "_id",
            as: "reasonrequireds"
          }
        },
        { $unwind: "$reasonrequireds" },
        { $match: { ...filter, "appointmentDate": { $gte: new Date(fromDate), $lte: new Date(toDate) } } },
        {
          "$project": {
            "createdAtWeek": { "$week": "$appointmentDate" },
            "createdAtMonth": { "$month": "$appointmentDate" },
            date: "$appointmentDate",
            reasonName: "$reasonrequireds.reasonName",
            status: "$status"
          }
        },
        {
          $group: {
            _id: {
              week: '$createdAtWeek',
              referal: '$reasonName',
              status: '$status'
            },
            totalappointment: { $sum: 1 }
          }
        },
        { $sort: { "_id.week": 1 } }
      ])

      let appointmentAudits = await AppointmentAudits.aggregate([
        {
          $lookup: {
            from: "reasonrequireds",
            localField: "appt_reason",
            foreignField: "_id",
            as: "reasonrequireds"
          }
        },
        { $unwind: "$reasonrequireds" },
        { $match: { ...filter, "appointmentDate": { $gte: new Date(fromDate), $lte: new Date(toDate) } } },
        {
          "$project": {
            "createdAtWeek": { "$week": "$appointmentDate" },
            "createdAtMonth": { "$month": "$appointmentDate" },
            date: "$appointmentDate",
            reasonName: "$reasonrequireds.reasonName",
            status: "$status"
          }
        },
        {
          $group: {
            _id: {
              week: '$createdAtWeek',
              referal: '$reasonName',
              status: '$status'
            },
            totalappointment: { $sum: 1 }
          }
        },
        { $sort: { "_id.week": 1 } }
      ])



      let overAllAppointments = appointments.concat(appointmentAudits)


      overAllAppointments.forEach(item => {

        let weekIndex = item._id.week;

        // console.log('WeekList in loop ***** ----->', listDate);

        let dateIndex = listDate.indexOf(weekIndex)


        if (dateIndex != -1) {
          // let status_referal = `${item._id.status}_${item._id.referal}`

          finalObj[item._id.status][item._id.referal][dateIndex] = item.totalappointment

        }
      })

    }
    else if (viewType == 'monthly') {
      appointments = await Appointments.aggregate([
        {
          $lookup: {
            from: "reasonrequireds",
            localField: "appt_reason",
            foreignField: "_id",
            as: "reasonrequireds"
          }
        },
        { $unwind: "$reasonrequireds" },
        { $match: { ...filter, "appointmentDate": { $gte: new Date(fromDate), $lte: new Date(toDate) } } },
        {
          "$project": {
            "createdAtWeek": { "$week": "$appointmentDate" },
            "createdAtMonth": { "$month": "$appointmentDate" },
            date: "$appointmentDate",
            reasonName: "$reasonrequireds.reasonName",
            status: "$status"
          }
        },
        {
          $group: {
            _id: {
              month: '$createdAtMonth',
              referal: '$reasonName',
              status: '$status'
            },
            totalappointment: { $sum: 1 }
          }
        },
        { $sort: { "_id.week": 1 } }
      ])


      let appointmentAudits = await AppointmentAudits.aggregate([
        {
          $lookup: {
            from: "reasonrequireds",
            localField: "appt_reason",
            foreignField: "_id",
            as: "reasonrequireds"
          }
        },
        { $unwind: "$reasonrequireds" },
        { $match: { ...filter, "appointmentDate": { $gte: new Date(fromDate), $lte: new Date(toDate) } } },
        {
          "$project": {
            "createdAtWeek": { "$week": "$appointmentDate" },
            "createdAtMonth": { "$month": "$appointmentDate" },
            date: "$appointmentDate",
            reasonName: "$reasonrequireds.reasonName",
            status: "$status"
          }
        },
        {
          $group: {
            _id: {
              month: '$createdAtMonth',
              referal: '$reasonName',
              status: '$status'
            },
            totalappointment: { $sum: 1 }
          }
        },
        { $sort: { "_id.week": 1 } }
      ])


      let overAllAppointments = appointments.concat(appointmentAudits)

      overAllAppointments.forEach(item => {

        let month = item._id.month;


        let dateIndex = listDate.indexOf(month)

        if (dateIndex != -1) {
          // let status_referal = `${item._id.status}_${item._id.referal}`

          finalObj[item._id.status][item._id.referal][dateIndex] = item.totalappointment

        }
      })

    };


    let dataset = []

    reasonOfAppointment.forEach((item, index) => {

      let bookedStatus = {
        label: 'Booked_' + item.reasonName,
        stack: 'stack ' + index,
        backgroundColor: getColor('booked', item.reasonName),
        data: finalObj['booked'][item.reasonName]
      }

      let cancelledStatus = {
        label: 'Cancelled_' + item.reasonName,
        stack: 'stack ' + index,
        backgroundColor: getColor('cancelled', item.reasonName),
        data: finalObj['cancelled'][item.reasonName]
      }

      let rescheduleStatus = {
        label: 'Rescheduled_' + item.reasonName,
        stack: 'stack ' + index,
        backgroundColor: getColor('rescheduled', item.reasonName),
        data: finalObj['rescheduled'][item.reasonName]
      }

      let absentStatus = {
        label: 'Absent_' + item.reasonName,
        stack: 'stack ' + index,
        backgroundColor: getColor('absent', item.reasonName),
        data: finalObj['absent'][item.reasonName]
      }

      // console.log('Rw data -------->', finalObj['rescheduled'][item.reasonName]);

      dataset.push(bookedStatus)
      dataset.push(cancelledStatus)
      dataset.push(rescheduleStatus)
      dataset.push(absentStatus)

    })

    console.log('len :', dataset.length)


    let bargraphData = {

      data: {
        labels: bargraphLabels,
        datasets: dataset
      },
    }


    res.status(200).send({
      upcomingAppointmentsCount: bargraphData,
    });

  }

}


function getColor(status, reasonName) {

  let status_referal = `${status}_${reasonName}`
  let color = ''
  switch (status_referal.toLowerCase()) {
    case 'absent_external speciality': {
      color = '#ff4da6'
      break;
    }

    case 'absent_lab confirmatory': {
      color = '#0040ff'
      break;
    }
    case 'absent_additional lab test': {
      color = '#ffe066'
      break;
    }
    case 'absent_retake': {
      color = '#ff8000'
      break;
    }
    case 'absent_additional x-ray': {
      color = '#66d9ff'
      break;
    }
    case 'absent_vaccination': {
      color = '#8533ff'
      break;
    }
    case 'absent_multiple': {
      color = '#00ffbf'
      break;
    }

    // ----------------------

    case 'booked_external speciality': {
      color = '#b30047'
      break;
    }
    case 'booked_lab confirmatory': {
      color = '#6699cc'
      break;
    }
    case 'booked_additional lab test': {
      color = '#dfff00'
      break;
    }
    case 'booked_retake': {
      color = '#daa520'
      break;
    }
    case 'booked_additional x-ray': {
      color = '#4dffff'
      break;
    }
    case 'booked_vaccination': {
      color = '#bf00ff'
      break;
    }
    case 'booked_multiple': {
      color = '#008060'
      break;
    }

    case 'cancelled_external speciality': {
      color = '#cc0052'
      break;
    }
    case 'cancelled_lab confirmatory': {
      color = '#232390'
      break;
    }
    case 'cancelled_additional lab test': {
      color = '#fff44f'
      break;
    }
    case 'cancelled_retake': {
      color = '#f4a460'
      break;
    }
    case 'cancelled_additional x-ray': {
      color = '#b3ffff'
      break;
    }
    case 'cancelled_vaccination': {
      color = '#6f00ff'
      break;
    }
    case 'cancelled_multiple': {
      color = '#009973'
      break;
    }

    case 'rescheduled_external speciality': {
      color = '#ca2c92'
      break;
    }
    case 'rescheduled_lab confirmatory': {
      color = '#000080'
      break;
    }

    case 'rescheduled_additional lab test': {
      color = '#ffdf00'
      break;
    }
    case 'rescheduled_retake': {
      color = '#a0522d'
      break;
    }
    case 'rescheduled_additional x-ray': {
      color = '#00cccc'
      break;
    }
    case 'rescheduled_vaccination': {
      color = '#9400d3'
      break;
    }
    case 'rescheduled_multiple': {
      color = '#00664d'
      break;
    }
  }

  return color;
}

module.exports = Appointment;
