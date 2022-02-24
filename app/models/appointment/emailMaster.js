const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emailSchema = new Schema({

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
            }
        },
        required: true
    },
    subject: {
        type: String,
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
    type: {
        type: String,
        enum: ['appointment confirmation', "appointment reminder", "appointment rescheduled", "appointment missed", "appointment cancellation"],
        required: true,
        lowercase: true
    }

}, {
    timestamps: true
})

emailSchema.index({ "medicalCenter.medicalCenterId": 1, type: 1 }, { unique: true });


module.exports = EmailTemplate = mongoose.model('EmailTemplate', emailSchema)