const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stationSequenceSchema = new Schema({
    businessId:{
        type:mongoose.Types.ObjectId,
        ref:'StationCenterwise',
        required:true

    },
    visaType: {
        type: String,
        required: true
    }, 
    priority: {
        type: [String],
        required:true,
        validate: v => Array.isArray(v) && v.length > 0,
    }, 
    Function: {
        type: [String],
        required:true,
        validate: v => Array.isArray(v) && v.length > 0,
    }, 
    Gender: {
        type: [String],
        required:true,
        validate: v => Array.isArray(v) && v.length > 0,
    }, 
    Age: {
        type: [String],
        required:true,
        validate: v => Array.isArray(v) && v.length > 0,
    }, 
    Pregnancy: {
        type: [String],
        required:true,
        validate: v => Array.isArray(v) && v.length > 0,
    }, 
    BMI: {
        type: [String],
        required:true,
        validate: v => Array.isArray(v) && v.length > 0,
    }, 
    intermediateReferral: {
        type: [String],
        required:true,
        validate: v => Array.isArray(v) && v.length > 0,
    }, 
    vaccinationVoucherPrint: {
        type: [String],
        required:true,
        validate: v => Array.isArray(v) && v.length > 0,
    },
    stationSequences: {
        type: [{
            type:mongoose.Types.ObjectId,
            ref:'StationCenterwise'
        }],
        validate: v => Array.isArray(v) && v.length > 0,
    }

}, {
    timestamps: true
})

module.exports = StationSequence = mongoose.model('StationSequence', stationSequenceSchema)