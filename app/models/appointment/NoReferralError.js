const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noReferralErrorSchema = new Schema(
    {


        country: {
            type: {
                countryId: {
                    type: mongoose.Types.ObjectId,
                    required: true
                },
                countryName: {
                    type: String,
                    required: true
                }
            },
            required: true
        },
        city: {
            type: {
                cityId: {
                    type: mongoose.Types.ObjectId,
                    required: true
                },
                cityName: {
                    type: String,
                    required: true
                }
            },
            required: true
        },
        medicalCenter: {
            type: {
                medicalCenterId: {
                    type: mongoose.Types.ObjectId,
                    required: true
                },
                medicalCenterName: {
                    type: String,
                    required: true
                },
                qvcCode: {
                    type: String,
                    required: true, unique: true
                },
            },
            required: true
        },

        body: {
            type: String,
            required: true
        },
        htmlBody: {
            type: String,
            required: true
        },
        operation: [{}],


    },
    {
        timestamps: true,
    }
);

module.exports = NoReferralError = mongoose.model("NoReferralError", noReferralErrorSchema);
