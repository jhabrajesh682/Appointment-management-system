const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({

    title: {
        type: String,
        required: true
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    className: {
        type: String,
        required: true
    },

    holiday: {
        type: mongoose.Types.ObjectId,
        ref: 'Holiday'
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

}, {
    timestamps: true
})

module.exports = ActionRequired = mongoose.model('Events', eventSchema)