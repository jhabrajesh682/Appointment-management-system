const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reasonSchema = new Schema(
  {
    reasonName: {
      type: String,
      required: true,
    },
    reasonDiscription: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = ReasonRequired = mongoose.model(
  "ReasonRequired",
  reasonSchema
);
