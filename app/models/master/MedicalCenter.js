const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const medicalCenterSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    qvcCode: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        maxlength: 255
    },

    addressDetails: {
        countryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Country',
            required: true
        },
        cityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'City',
            required: true
        },
        address: {
            type: String,
            required: true,
            minlength: 10,
            maxlength: 255
        },
        zipCode: {
            type: String,
            maxlength: 10,
            required: true
        }
    },
    businessId: {
        type: mongoose.Types.ObjectId,
        ref: "Business",
        required: true
    },
    customercare: [{
        type: String,
        maxlength: 20
    }],

}, {
    timestamps: true
})

medicalCenterSchema.virtual('stations', {
    ref: 'StationCenterwise',
    localField: '_id',
    foreignField: 'medicalCenterId',
    justOne: false

});
medicalCenterSchema.virtual('ServiceCounter', {
    ref: 'ServiceCounter',
    localField: '_id',
    foreignField: 'medicalCenterId',
    justOne: false
})
medicalCenterSchema.set('toObject', { virtuals: true });
medicalCenterSchema.set('toJSON', { virtuals: true });

module.exports = MedicalCenter = mongoose.model('MedicalCenter', medicalCenterSchema)