const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reasonActionSchema = new Schema({
  reason: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReasonRequired",
      required: true,
    },
  ],

  action: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ActionRequired",
    },
  ],
});

module.exports = reasonActionMapping = mongoose.model(
  "reasonActionMapping",
  reasonActionSchema
);
