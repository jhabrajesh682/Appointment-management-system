const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const holidaySchema = new Schema({


    holidayName: {
        type: String,
        required: true
    },
    holidayDiscription: {
        type: String,
        required: true
    },

    date: {
        type: String,
        required: true
    },

    timeZone: {
        type: String,
        required: true
    },

    country: {
        type:{
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
            countryName: {
                type: String,
                required: true
            }
        },
        required: true
    },


    isActive: {
        type: Boolean,
        required: true,
        default: true
    }


}, {
    timestamps: true
})

module.exports = Holiday = mongoose.model('Holiday', holidaySchema)