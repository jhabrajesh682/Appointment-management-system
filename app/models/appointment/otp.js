const mongoose = require('mongoose');
const { string } = require('@hapi/joi');
const Schema = mongoose.Schema;

const otpSchema = new Schema({

    mobile: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    status : {
        type: String,
        required : true
    },
    created : {
        type : String,
        required : true
    }

}, {
    timestamps: true
})

module.exports = Otp = mongoose.model('Otp', otpSchema)