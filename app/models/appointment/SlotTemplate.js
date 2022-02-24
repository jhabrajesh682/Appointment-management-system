const mongoose = require("mongoose");
const { string } = require("@hapi/joi");
const Schema = mongoose.Schema;

const slotTemplateSchema = new Schema(
  {
    templateName: {
      type: String,
      required: true,
    },
    timeZone: {
      type: String,
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
      },
      required: true,
    },

    slotCollection: {
      week1: {
        mondaySlot: [
          {
            starttime: {
              type: String,
              required: true,
            },
            endtime: {
              type: String,
              required: true,
            },
            serviceCategory: {
              reasonForAppointment: [{
                type: mongoose.Types.ObjectId,
                ref: "ReasonRequired",
                required: true,
              }],
              actionRequired: [
                {
                  type: mongoose.Types.ObjectId,
                  ref: "ActionRequired",
                  required: true,
                },
              ],
            },
            availableLimit: {
              type: Number,
              required: true,
            },
            consumedCount: {
              type: Number,
              default: 0,

              validate: {
                validator: function (params) {
                  return this.availableLimit >= params;
                },
                message: "running count must be less than equal to totalcount",
              },
            },
            isAvailable: {
              type: Boolean,
              required: true,
              default: true,
            },
          },
        ],
        tuesdaySlot: [
          {
            starttime: {
              type: String,
              required: true,
            },
            endtime: {
              type: String,
              required: true,
            },
            serviceCategory: {
              reasonForAppointment: [{
                type: mongoose.Types.ObjectId,
                ref: "ReasonRequired",
                required: true,
              }],
              actionRequired: [
                {
                  type: mongoose.Types.ObjectId,
                  ref: "ActionRequired",
                  required: true,
                },
              ],
            },
            availableLimit: {
              type: Number,
              required: true,
            },
            consumedCount: {
              type: Number,

              validate: {
                validator: function (params) {
                  return this.availableLimit >= params;
                },
                message: "running count must be less than equal to totalcount",
              },
            },
            isAvailable: {
              type: Boolean,
              required: true,
              default: true,
            },
          },
        ],
        wednesdaySlot: [
          {
            starttime: {
              type: String,
              required: true,
            },
            endtime: {
              type: String,
              required: true,
            },
            serviceCategory: {
              reasonForAppointment: [{
                type: mongoose.Types.ObjectId,
                ref: "ReasonRequired",
                required: true,
              }],
              actionRequired: [
                {
                  type: mongoose.Types.ObjectId,
                  ref: "ActionRequired",
                  required: true,
                },
              ],
            },
            availableLimit: {
              type: Number,
              required: true,
            },
            consumedCount: {
              type: Number,
              validate: {
                validator: function (params) {
                  return this.availableLimit >= params;
                },
                message: "running count must be less than equal to totalcount",
              },
            },
            isAvailable: {
              type: Boolean,
              required: true,
              default: true,
            },
          },
        ],
        thursdaySlot: [
          {
            starttime: {
              type: String,
              required: true,
            },
            endtime: {
              type: String,
              required: true,
            },
            serviceCategory: {
              reasonForAppointment: [{
                type: mongoose.Types.ObjectId,
                ref: "ReasonRequired",
                required: true,
              }],
              actionRequired: [
                {
                  type: mongoose.Types.ObjectId,
                  ref: "ActionRequired",
                  required: true,
                },
              ],
            },
            availableLimit: {
              type: Number,
              required: true,
            },
            consumedCount: {
              type: Number,
              validate: {
                validator: function (params) {
                  return this.availableLimit >= params;
                },
                message: "running count must be less than equal to totalcount",
              },
            },
            isAvailable: {
              type: Boolean,
              required: true,
              default: true,
            },
          },
        ],
        fridaySlot: [
          {
            starttime: {
              type: String,
              required: true,
            },
            endtime: {
              type: String,
              required: true,
            },
            serviceCategory: {
              reasonForAppointment: [{
                type: mongoose.Types.ObjectId,
                ref: "ReasonRequired",
                required: true,
              }],
              actionRequired: [
                {
                  type: mongoose.Types.ObjectId,
                  ref: "ActionRequired",
                  required: true,
                },
              ],
            },
            availableLimit: {
              type: Number,
              required: true,
            },
            consumedCount: {
              type: Number,
              validate: {
                validator: function (params) {
                  return this.availableLimit >= params;
                },
                message: "running count must be less than equal to totalcount",
              },
            },
            isAvailable: {
              type: Boolean,
              required: true,
              default: true,
            },
          },
        ],
        saturdaySlot: [
          {
            starttime: {
              type: String,
              required: true,
            },
            endtime: {
              type: String,
              required: true,
            },
            serviceCategory: {
              reasonForAppointment: [{
                type: mongoose.Types.ObjectId,
                ref: "ReasonRequired",
                required: true,
              }],
              actionRequired: [
                {
                  type: mongoose.Types.ObjectId,
                  ref: "ActionRequired",
                  required: true,
                },
              ],
            },
            availableLimit: {
              type: Number,
              required: true,
            },
            consumedCount: {
              type: Number,
              validate: {
                validator: function (params) {
                  return this.availableLimit >= params;
                },
                message: "running count must be less than equal to totalcount",
              },
            },
            isAvailable: {
              type: Boolean,
              required: true,
              default: true,
            },
          },
        ],
        sundaySlot: [
          {
            starttime: {
              type: String,
              required: true,
            },
            endtime: {
              type: String,
              required: true,
            },
            serviceCategory: {
              reasonForAppointment: [{
                type: mongoose.Types.ObjectId,
                ref: "ReasonRequired",
                required: true,
              }],
              actionRequired: [
                {
                  type: mongoose.Types.ObjectId,
                  ref: "ActionRequired",
                  required: true,
                },
              ],
            },
            availableLimit: {
              type: Number,
              required: true,
            },
            consumedCount: {
              type: Number,
              validate: {
                validator: function (params) {
                  return this.availableLimit >= params;
                },
                message: "running count must be less than equal to totalcount",
              },
            },
            isAvailable: {
              type: Boolean,
              required: true,
              default: true,
            },
          },
        ],
      },
      week2: {
        mondaySlot: [
          {
            starttime: {
              type: String,
              required: true,
            },
            endtime: {
              type: String,
              required: true,
            },
            serviceCategory: {
              reasonForAppointment: [{
                type: mongoose.Types.ObjectId,
                ref: "ReasonRequired",
                required: true,
              }],
              actionRequired: [
                {
                  type: mongoose.Types.ObjectId,
                  ref: "ActionRequired",
                  required: true,
                },
              ],
            },
            availableLimit: {
              type: Number,
              required: true,
            },
            consumedCount: {
              type: Number,
              validate: {
                validator: function (params) {
                  return this.availableLimit >= params;
                },
                message: "running count must be less than equal to totalcount",
              },
            },
            isAvailable: {
              type: Boolean,
              required: true,
              default: true,
            },
          },
        ],
        tuesdaySlot: [
          {
            starttime: {
              type: String,
              required: true,
            },
            endtime: {
              type: String,
              required: true,
            },
            serviceCategory: {
              reasonForAppointment: [{
                type: mongoose.Types.ObjectId,
                ref: "ReasonRequired",
                required: true,
              }],
              actionRequired: [
                {
                  type: mongoose.Types.ObjectId,
                  ref: "ActionRequired",
                  required: true,
                },
              ],
            },
            availableLimit: {
              type: Number,
              required: true,
            },
            consumedCount: {
              type: Number,
              validate: {
                validator: function (params) {
                  return this.availableLimit >= params;
                },
                message: "running count must be less than equal to totalcount",
              },
            },
            isAvailable: {
              type: Boolean,
              required: true,
              default: true,
            },
          },
        ],
        wednesdaySlot: [
          {
            starttime: {
              type: String,
              required: true,
            },
            endtime: {
              type: String,
              required: true,
            },
            serviceCategory: {
              reasonForAppointment: [{
                type: mongoose.Types.ObjectId,
                ref: "ReasonRequired",
                required: true,
              }],
              actionRequired: [
                {
                  type: mongoose.Types.ObjectId,
                  ref: "ActionRequired",
                  required: true,
                },
              ],
            },
            availableLimit: {
              type: Number,
              required: true,
            },
            consumedCount: {
              type: Number,
              validate: {
                validator: function (params) {
                  return this.availableLimit >= params;
                },
                message: "running count must be less than equal to totalcount",
              },
            },
            isAvailable: {
              type: Boolean,
              required: true,
              default: true,
            },
          },
        ],
        thursdaySlot: [
          {
            starttime: {
              type: String,
              required: true,
            },
            endtime: {
              type: String,
              required: true,
            },
            serviceCategory: {
              reasonForAppointment: [{
                type: mongoose.Types.ObjectId,
                ref: "ReasonRequired",
                required: true,
              }],
              actionRequired: [
                {
                  type: mongoose.Types.ObjectId,
                  ref: "ActionRequired",
                  required: true,
                },
              ],
            },
            availableLimit: {
              type: Number,
              required: true,
            },
            consumedCount: {
              type: Number,
              validate: {
                validator: function (params) {
                  return this.availableLimit >= params;
                },
                message: "running count must be less than equal to totalcount",
              },
            },
            isAvailable: {
              type: Boolean,
              required: true,
              default: true,
            },
          },
        ],
        fridaySlot: [
          {
            starttime: {
              type: String,
              required: true,
            },
            endtime: {
              type: String,
              required: true,
            },
            serviceCategory: {
              reasonForAppointment: [{
                type: mongoose.Types.ObjectId,
                ref: "ReasonRequired",
                required: true,
              }],
              actionRequired: [
                {
                  type: mongoose.Types.ObjectId,
                  ref: "ActionRequired",
                  required: true,
                },
              ],
            },
            availableLimit: {
              type: Number,
              required: true,
            },
            consumedCount: {
              type: Number,
              validate: {
                validator: function (params) {
                  return this.availableLimit >= params;
                },
                message: "running count must be less than equal to totalcount",
              },
            },
            isAvailable: {
              type: Boolean,
              required: true,
              default: true,
            },
          },
        ],
        saturdaySlot: [
          {
            starttime: {
              type: String,
              required: true,
            },
            endtime: {
              type: String,
              required: true,
            },
            serviceCategory: {
              reasonForAppointment: [{
                type: mongoose.Types.ObjectId,
                ref: "ReasonRequired",
                required: true,
              }],
              actionRequired: [
                {
                  type: mongoose.Types.ObjectId,
                  ref: "ActionRequired",
                  required: true,
                },
              ],
            },
            availableLimit: {
              type: Number,
              required: true,
            },
            consumedCount: {
              type: Number,
              validate: {
                validator: function (params) {
                  return this.availableLimit >= params;
                },
                message: "running count must be less than equal to totalcount",
              },
            },
            isAvailable: {
              type: Boolean,
              required: true,
              default: true,
            },
          },
        ],
        sundaySlot: [
          {
            starttime: {
              type: String,
              required: true,
            },
            endtime: {
              type: String,
              required: true,
            },
            serviceCategory: {
              reasonForAppointment: [{
                type: mongoose.Types.ObjectId,
                ref: "ReasonRequired",
                required: true,
              }],
              actionRequired: [
                {
                  type: mongoose.Types.ObjectId,
                  ref: "ActionRequired",
                  required: true,
                },
              ],
            },
            availableLimit: {
              type: Number,
              required: true,
            },
            consumedCount: {
              type: Number,
              validate: {
                validator: function (params) {
                  return this.availableLimit >= params;
                },
                message: "running count must be less than equal to totalcount",
              },
            },
            isAvailable: {
              type: Boolean,
              required: true,
              default: true,
            },
          },
        ],
      },
      week3: {
        mondaySlot: [
          {
            starttime: {
              type: String,
              required: true,
            },
            endtime: {
              type: String,
              required: true,
            },
            serviceCategory: {
              reasonForAppointment: [{
                type: mongoose.Types.ObjectId,
                ref: "ReasonRequired",
                required: true,
              }],
              actionRequired: [
                {
                  type: mongoose.Types.ObjectId,
                  ref: "ActionRequired",
                  required: true,
                },
              ],
            },
            availableLimit: {
              type: Number,
              required: true,
            },
            consumedCount: {
              type: Number,
              validate: {
                validator: function (params) {
                  return this.availableLimit >= params;
                },
                message: "running count must be less than equal to totalcount",
              },
            },
            isAvailable: {
              type: Boolean,
              required: true,
              default: true,
            },
          },
        ],
        tuesdaySlot: [
          {
            starttime: {
              type: String,
              required: true,
            },
            endtime: {
              type: String,
              required: true,
            },
            serviceCategory: {
              reasonForAppointment: [{
                type: mongoose.Types.ObjectId,
                ref: "ReasonRequired",
                required: true,
              }],
              actionRequired: [
                {
                  type: mongoose.Types.ObjectId,
                  ref: "ActionRequired",
                  required: true,
                },
              ],
            },
            availableLimit: {
              type: Number,
              required: true,
            },
            consumedCount: {
              type: Number,
              validate: {
                validator: function (params) {
                  return this.availableLimit >= params;
                },
                message: "running count must be less than equal to totalcount",
              },
            },
            isAvailable: {
              type: Boolean,
              required: true,
              default: true,
            },
          },
        ],
        wednesdaySlot: [
          {
            starttime: {
              type: String,
              required: true,
            },
            endtime: {
              type: String,
              required: true,
            },
            serviceCategory: {
              reasonForAppointment: [{
                type: mongoose.Types.ObjectId,
                ref: "ReasonRequired",
                required: true,
              }],
              actionRequired: [
                {
                  type: mongoose.Types.ObjectId,
                  ref: "ActionRequired",
                  required: true,
                },
              ],
            },
            availableLimit: {
              type: Number,
              required: true,
            },
            consumedCount: {
              type: Number,
              validate: {
                validator: function (params) {
                  return this.availableLimit >= params;
                },
                message: "running count must be less than equal to totalcount",
              },
            },
            isAvailable: {
              type: Boolean,
              required: true,
              default: true,
            },
          },
        ],
        thursdaySlot: [
          {
            starttime: {
              type: String,
              required: true,
            },
            endtime: {
              type: String,
              required: true,
            },
            serviceCategory: {
              reasonForAppointment: [{
                type: mongoose.Types.ObjectId,
                ref: "ReasonRequired",
                required: true,
              }],
              actionRequired: [
                {
                  type: mongoose.Types.ObjectId,
                  ref: "ActionRequired",
                  required: true,
                },
              ],
            },
            availableLimit: {
              type: Number,
              required: true,
            },
            consumedCount: {
              type: Number,
              validate: {
                validator: function (params) {
                  return this.availableLimit >= params;
                },
                message: "running count must be less than equal to totalcount",
              },
            },
            isAvailable: {
              type: Boolean,
              required: true,
              default: true,
            },
          },
        ],
        fridaySlot: [
          {
            starttime: {
              type: String,
              required: true,
            },
            endtime: {
              type: String,
              required: true,
            },
            serviceCategory: {
              reasonForAppointment: [{
                type: mongoose.Types.ObjectId,
                ref: "ReasonRequired",
                required: true,
              }],
              actionRequired: [
                {
                  type: mongoose.Types.ObjectId,
                  ref: "ActionRequired",
                  required: true,
                },
              ],
            },
            availableLimit: {
              type: Number,
              required: true,
            },
            consumedCount: {
              type: Number,
              validate: {
                validator: function (params) {
                  return this.availableLimit >= params;
                },
                message: "running count must be less than equal to totalcount",
              },
            },
            isAvailable: {
              type: Boolean,
              required: true,
              default: true,
            },
          },
        ],
        saturdaySlot: [
          {
            starttime: {
              type: String,
              required: true,
            },
            endtime: {
              type: String,
              required: true,
            },
            serviceCategory: {
              reasonForAppointment: [{
                type: mongoose.Types.ObjectId,
                ref: "ReasonRequired",
                required: true,
              }],
              actionRequired: [
                {
                  type: mongoose.Types.ObjectId,
                  ref: "ActionRequired",
                  required: true,
                },
              ],
            },
            availableLimit: {
              type: Number,
              required: true,
            },
            consumedCount: {
              type: Number,
              validate: {
                validator: function (params) {
                  return this.availableLimit >= params;
                },
                message: "running count must be less than equal to totalcount",
              },
            },
            isAvailable: {
              type: Boolean,
              required: true,
              default: true,
            },
          },
        ],
        sundaySlot: [
          {
            starttime: {
              type: String,
              required: true,
            },
            endtime: {
              type: String,
              required: true,
            },
            serviceCategory: {
              reasonForAppointment: [{
                type: mongoose.Types.ObjectId,
                ref: "ReasonRequired",
                required: true,
              }],
              actionRequired: [
                {
                  type: mongoose.Types.ObjectId,
                  ref: "ActionRequired",
                  required: true,
                },
              ],
            },
            availableLimit: {
              type: Number,
              required: true,
            },
            consumedCount: {
              type: Number,
              validate: {
                validator: function (params) {
                  return this.availableLimit >= params;
                },
                message: "running count must be less than equal to totalcount",
              },
            },
            isAvailable: {
              type: Boolean,
              required: true,
              default: true,
            },
          },
        ],
      },
      week4: {
        mondaySlot: [
          {
            starttime: {
              type: String,
              required: true,
            },
            endtime: {
              type: String,
              required: true,
            },
            serviceCategory: {
              reasonForAppointment: [{
                type: mongoose.Types.ObjectId,
                ref: "ReasonRequired",
                required: true,
              }],
              actionRequired: [
                {
                  type: mongoose.Types.ObjectId,
                  ref: "ActionRequired",
                  required: true,
                },
              ],
            },
            availableLimit: {
              type: Number,
              required: true,
            },
            consumedCount: {
              type: Number,
              validate: {
                validator: function (params) {
                  return this.availableLimit >= params;
                },
                message: "running count must be less than equal to totalcount",
              },
            },
            isAvailable: {
              type: Boolean,
              required: true,
              default: true,
            },
          },
        ],
        tuesdaySlot: [
          {
            starttime: {
              type: String,
              required: true,
            },
            endtime: {
              type: String,
              required: true,
            },
            serviceCategory: {
              reasonForAppointment: [{
                type: mongoose.Types.ObjectId,
                ref: "ReasonRequired",
                required: true,
              }],
              actionRequired: [
                {
                  type: mongoose.Types.ObjectId,
                  ref: "ActionRequired",
                  required: true,
                },
              ],
            },
            availableLimit: {
              type: Number,
              required: true,
            },
            consumedCount: {
              type: Number,
              validate: {
                validator: function (params) {
                  return this.availableLimit >= params;
                },
                message: "running count must be less than equal to totalcount",
              },
            },
            isAvailable: {
              type: Boolean,
              required: true,
              default: true,
            },
          },
        ],
        wednesdaySlot: [
          {
            starttime: {
              type: String,
              required: true,
            },
            endtime: {
              type: String,
              required: true,
            },
            serviceCategory: {
              reasonForAppointment: [{
                type: mongoose.Types.ObjectId,
                ref: "ReasonRequired",
                required: true,
              }],
              actionRequired: [
                {
                  type: mongoose.Types.ObjectId,
                  ref: "ActionRequired",
                  required: true,
                },
              ],
            },
            availableLimit: {
              type: Number,
              required: true,
            },
            consumedCount: {
              type: Number,
              validate: {
                validator: function (params) {
                  return this.availableLimit >= params;
                },
                message: "running count must be less than equal to totalcount",
              },
            },
            isAvailable: {
              type: Boolean,
              required: true,
              default: true,
            },
          },
        ],
        thursdaySlot: [
          {
            starttime: {
              type: String,
              required: true,
            },
            endtime: {
              type: String,
              required: true,
            },
            serviceCategory: {
              reasonForAppointment: [{
                type: mongoose.Types.ObjectId,
                ref: "ReasonRequired",
                required: true,
              }],
              actionRequired: [
                {
                  type: mongoose.Types.ObjectId,
                  ref: "ActionRequired",
                  required: true,
                },
              ],
            },
            availableLimit: {
              type: Number,
              required: true,
            },
            consumedCount: {
              type: Number,
              validate: {
                validator: function (params) {
                  return this.availableLimit >= params;
                },
                message: "running count must be less than equal to totalcount",
              },
            },
            isAvailable: {
              type: Boolean,
              required: true,
              default: true,
            },
          },
        ],
        fridaySlot: [
          {
            starttime: {
              type: String,
              required: true,
            },
            endtime: {
              type: String,
              required: true,
            },
            serviceCategory: {
              reasonForAppointment: [{
                type: mongoose.Types.ObjectId,
                ref: "ReasonRequired",
                required: true,
              }],
              actionRequired: [
                {
                  type: mongoose.Types.ObjectId,
                  ref: "ActionRequired",
                  required: true,
                },
              ],
            },
            availableLimit: {
              type: Number,
              required: true,
            },
            consumedCount: {
              type: Number,
              validate: {
                validator: function (params) {
                  return this.availableLimit >= params;
                },
                message: "running count must be less than equal to totalcount",
              },
            },
            isAvailable: {
              type: Boolean,
              required: true,
              default: true,
            },
          },
        ],
        saturdaySlot: [
          {
            starttime: {
              type: String,
              required: true,
            },
            endtime: {
              type: String,
              required: true,
            },
            serviceCategory: {
              reasonForAppointment: [{
                type: mongoose.Types.ObjectId,
                ref: "ReasonRequired",
                required: true,
              }],
              actionRequired: [
                {
                  type: mongoose.Types.ObjectId,
                  ref: "ActionRequired",
                  required: true,
                },
              ],
            },
            availableLimit: {
              type: Number,
              required: true,
            },
            consumedCount: {
              type: Number,
              validate: {
                validator: function (params) {
                  return this.availableLimit >= params;
                },
                message: "running count must be less than equal to totalcount",
              },
            },
            isAvailable: {
              type: Boolean,
              required: true,
              default: true,
            },
          },
        ],
        sundaySlot: [
          {
            starttime: {
              type: String,
              required: true,
            },
            endtime: {
              type: String,
              required: true,
            },
            serviceCategory: {
              reasonForAppointment: [{
                type: mongoose.Types.ObjectId,
                ref: "ReasonRequired",
                required: true,
              }],
              actionRequired: [
                {
                  type: mongoose.Types.ObjectId,
                  ref: "ActionRequired",
                  required: true,
                },
              ],
            },
            availableLimit: {
              type: Number,
              required: true,
            },
            consumedCount: {
              type: Number,
              validate: {
                validator: function (params) {
                  return this.availableLimit >= params;
                },
                message: "running count must be less than equal to totalcount",
              },
            },
            isAvailable: {
              type: Boolean,
              required: true,
              default: true,
            },
          },
        ],
      },
    },
    loggedUserID: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    }, // Who created this entry
    loggedDate: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    weekend: [{
      type: String,
      enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      required: true,
      lowercase: true
    }],
    isPublished: {
      type: Boolean,
      default: false
    },
    lastDate: {
      type: Date,
    },
    timming: {
      type: {
        startTime: {
          type: String,
          required: true,
        },
        interval: {
          type: Number,
          required: true,
        },
        break: {
          starttime: {
            type: String,
            required: true,
          },
          endtime: {
            type: String,
            required: true,
          }
        },
        endTime: {
          type: String,
          required: true,
        },
      },
      required: true
    }

  },
  {
    timestamps: true,
  }
);

module.exports = SlotTemplate = mongoose.model(
  "SlotTemplate",
  slotTemplateSchema
);
