const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const actionSchema = new Schema({

    visaApplicationNumber: {
        type: String,
        // required: true
    },
    fullName: {
        type: String,
        // required: true
    },
    gender: {
        type: String,
        // required: true
    },
    dob: {
        type: String,
        // required: true
    },
    passportNumber: {
        type: String,
        // required: true
    },
    location: {
        type: String,
        // required: true
    },
    visaApplicationNumber: {
        type: String,
        // required: true
    },
    contactHome: {
        type: String,
        // required: true
    },
    contactOffice: {
        type: String,
        // required: true
    },
    contactMobile: {
        type: String,
        // required: true
    },
    passportNumber: {
        type: String,
        // required: true
    },
    appointmentType: {
        type: String,
        // required: true
    },
    emailId: {
        type: String,
        // required: true
    },
    sponsortypename: {
        type: String,
        // required: true
    },
    sponsorsubtypename: {
        type: String,
        // required: true
    },
    referralDetails: [
        {
            Referralid: {
                type: Number, //"1002"
                // required: true,
            },
            Referral: {
                type: String, //"Additional-Xray"
                // required: true,
            },
            ReferralAction: [
                {
                    type: String, //"Additional-Xray"
                    // required: true,
                },
            ],
            Nextactiondate: {
                type: Date,
                // required: true,
            },
        },
    ],


}, {
    timestamps: true
})

module.exports = ApplicantDetails = mongoose.model('ApplicantDetails', actionSchema)