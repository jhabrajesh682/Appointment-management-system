const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const slotSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },

    starttime: {
      type: String,
      required: true,
    },

    endtime: {
      type: String,
      required: true,
    },

    serviceCategory: {
      reasonForAppointment: {
        type: mongoose.Types.ObjectId,
        ref: "ReasonRequired",
        required: true,
      },

      actionRequired: [
        {
          type: mongoose.Types.ObjectId,
          ref: "ActionRequired",

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
    slotGroup: {
      type: mongoose.Types.ObjectId,
      ref: "SlotGroup",
    },
    templateId: {
      type: mongoose.Types.ObjectId,
      ref: "SlotTemplate",
    },
  },
  {
    timestamps: true,
  }
);

slotSchema.virtual("Appointments", {
  ref: "Appointment",
  localField: "_id",
  foreignField: "slotId",
  justOne: false,
});
slotSchema.set("toObject", { virtuals: true });
slotSchema.set("toJSON", { virtuals: true });

module.exports = Slot = mongoose.model("Slot", slotSchema);
