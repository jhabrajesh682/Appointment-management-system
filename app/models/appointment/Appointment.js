const mongoose = require("mongoose");
const { number, boolean } = require("@hapi/joi");
const email = require("../../helpers/email");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema(
  {
    visa_ref_no: {
      type: String,
      required: true,
    },

    passport_no: {
      type: String,
      required: true,
    },

    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    date_of_birth: {
      type: Date,
      required: true,
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    country: {
      type: {
        countryId: {
          type: mongoose.Types.ObjectId,
          required: true,
        },
        countryName: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    city: {
      type: {
        cityId: {
          type: mongoose.Types.ObjectId,
          required: true,
        },
        cityName: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    medicalCenter: {
      type: {
        medicalCenterId: {
          type: mongoose.Types.ObjectId,
          required: true,
        },
        medicalCenterName: {
          type: String,
          required: true,
        },
        medicalCenterAddress: {
          type: String,
          required: true,
          minlength: 10,
          maxlength: 255
        },
        zipCode: {
          type: String,
          required: true,
          maxlength: 10,
        },
        customerCare: [{
          type: String,
          required: true,
        }]
      },
      required: true,
    },

    appt_reason: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "ReasonRequired",
    },

    actionRequired: [
      {
        type: mongoose.Types.ObjectId,
        ref: "ActionRequired",
      },
    ],

    slotId: {
      type: mongoose.Types.ObjectId,
      ref: "Slot",
      required: true,
    },

    callCenter: {
      type: Boolean,
      required: false
    },

    user_login_status: {
      type: String,
    },

    referralDetails: [
      {
        Referralid: {
          type: Number, //"1002"
          required: true,
        },
        Referral: {
          type: String, //"Additional-Xray"
          required: true,
        },
        ReferralAction: [
          {
            type: String, //"Additional-Xray"
            required: true,
          },
        ],
        Nextactiondate: {
          type: Date,
          required: true,
        },
      },
    ],

    status: {
      type: String,
      enum: ["rescheduled", "cancelled", "completed", "booked", "absent"],
      default: "booked",

      lowercase: true,
    },
    callCenter: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = Appointment = mongoose.model("Appointment", appointmentSchema);
