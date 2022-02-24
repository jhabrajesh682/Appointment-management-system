const Reasons = require("../models/appointment/ReasonMaster");
const Actions = require("../models/appointment/ActionMaster");
const Otp = require("../models/appointment/otp")
const validate = require("../validators/userDetail.validator");
const otp = require("../_helpers/otp")
const SMS = require("../_helpers/sms")
const MedicalCenterModal = require("../models/master/MedicalCenter");
const moment = require('moment')

const sendSms = require('../helpers/sms')


const axios = require("axios");
const TmsUrl = process.env.TMS_LINK + process.env.TMS_V1;
const GlosysUrl = process.env.GLOSYS_LINK

const header = {
  "X-CSRF-TOKEN": process.env.GLOSYS_X_CSRF_TOKEN,
  "X-USER-SITE": process.env.GLOSYS_X_USER_SITE
}

class UserDetail {
  /**
   * @function - Get all the registered users from the db
   *
   * @param - Express.req , Express.res
   *
   * @returns - List of registered users
   */

  async findUserDetails(req, res) {

    console.log("API called 1st one=======>❌❌❌ ");

    let { error } = validate.validateUserDetail(req.body);
    if (error) {
      return res.status(400).send({
        message: "failed",
        result: error,
      });
    }

    /***************************code commented by Brajesh jha**************************/

    // let sms = new SMS();

    // let o = await otp();

    // let otpData = new Otp({
    //   mobile: req.body.contact,
    //   otp: o,
    //   status: "INIT",
    //   created: Date.now()
    // })

    // await otpData.save()

    // let body = `Your stemz otp is ${o}`

    // // await sms.loginOtp(o, req.body.contact);

    // sendSms({ number: req.body.contact, body: body })


    let reason;
    let actions;
    let qvcCode;
    let obj = {};

    if (req.body.reason.length > 1) {
      reason = "Multiple";
      obj.isMultiple = true;
    } else {
      reason = req.body.reason[0];
    }
    actions = req.body.actions;
    qvcCode = req.body.qvcCode;

    let reasonId = await Reasons.findOne({ reasonName: reason })
      .select("_id reasonName")
      .lean();
    let actionId = await Actions.find({ actionName: { $in: actions } })
      .select("_id actionName")
      .lean();

    let medicalCenterId = await MedicalCenterModal.findOne({
      qvcCode: qvcCode,
    })
      .populate("addressDetails.countryId")
      .populate("addressDetails.cityId")
      .lean();


    let actualreason = [...req.body.reason];
    let actualReasons = await Reasons.find({
      reasonName: { $in: actualreason },
    })
      .select("_id reasonName")
      .lean();

    obj.reason = reasonId;
    obj.action = actionId;
    obj.medicalCenter = medicalCenterId;
    obj.actualReasons = actualReasons;

    console.log(obj);

    return res.status(200).send({
      message: "Userdetail",
      userDetails: obj,
    });
  }

  async findUserDetailsWithoutOtpt(req, res) {




    let { error } = validate.validateUserDetailWithoutOtp(req.body);
    if (error) {
      return res.status(400).send({
        message: "failed",
        result: error,
      });
    }



    let reason;
    let actions;
    let qvcCode;
    let obj = {};

    if (req.body.reason.length > 1) {
      reason = "Multiple";
      obj.isMultiple = true;
    } else {
      reason = req.body.reason[0];
    }
    actions = req.body.actions;
    qvcCode = req.body.qvcCode;

    let reasonId = await Reasons.findOne({ reasonName: reason })
      .select("_id reasonName")
      .lean();
    let actionId = await Actions.find({ actionName: { $in: actions } })
      .select("_id actionName")
      .lean();

    let medicalCenterId = await MedicalCenterModal.findOne({
      qvcCode: qvcCode,
    })
      .populate("addressDetails.countryId")
      .populate("addressDetails.cityId")
      .lean();



    let actualreason = [...req.body.reason];
    let actualReasons = await Reasons.find({
      reasonName: { $in: actualreason },
    })
      .select("_id reasonName")
      .lean();

    obj.reason = reasonId;
    obj.action = actionId;
    obj.medicalCenter = medicalCenterId;
    obj.actualReasons = actualReasons;

    console.log(obj);

    return res.status(200).send({
      message: "Userdetail",
      userDetails: obj,
    });
  }

  async getApplicantData(req, res) {
    console.log("API called=======>❌❌❌ ");
    let { error } = validate.validateApplicantData(req.body);
    if (error) {
      return res.status(400).send({
        message: "failed",
        result: error,
      });
    }


    const headers = {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': header["X-CSRF-TOKEN"],
      'X-USER-SITE': header["X-USER-SITE"]
    }

    try {
      let { data } = await axios.post(GlosysUrl + "getapplicantdata",
        { visaApplicantNumber: req.body.visa_no, dob: req.body.dob, passportNumber: req.body.passport_no },
        { headers: headers }
      );

      console.log("data from gloysys=====>❌", data.contactMobile);

      let frmDate = moment(new Date())
      let eDate = moment(new Date())

      let start = new Date(frmDate);
      start.setHours(0, 0, 0, 0);

      let end = new Date(eDate);
      end.setHours(23, 59, 59, 999);
      let otps = await Otp.find({ createdAt: { $gte: start, $lte: end }, mobile: data.contactMobile, status: "INIT" }).count();

      console.log("otps=====>❌❌❌❌❌❌❌❌ ", otps);

      if (otps <= 8) {
        let sms = new SMS();

        let o = await otp();

        let otpData = new Otp({
          mobile: data.contactMobile,
          otp: o,
          status: "INIT",
          created: Date.now()
        })

        await otpData.save()

        let body = `Your stemz otp is ${o}`

        // await sms.loginOtp(o, req.body.contact);

        sendSms({ number: data.contactMobile, body: body })

        if (data.hasOwnProperty('message')) {
          return res.status(400).send({
            message: data.message,
            status: false,
          });
        }

        return res.status(200).send({
          status: true,
          result: data
        });

      }
      else {
        console.log("into otp else");
        return res.status(429).send({
          status: false,
          message: "Maximum OTP limit Reached"
        })
      }

    } catch (error) {
      console.log(error);

      return res.status(500).send({
        message: "failed",
        result: error,
      });
    }


  }
}

module.exports = UserDetail;
