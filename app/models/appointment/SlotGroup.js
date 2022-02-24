const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slotGroupSchema = new Schema({


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
            medicalCenterName:{
                type: String,
                required: true
            }
        },
        required: true
    },
    timeZone: {
        type: String,
        required: true
    },
    loggedUserID: {
        type: String,
        // required: true
    },  // Who created this entry 
    loggedDate: {
        type: Date,
        required: true,
        default: Date.now()
    },  // When was it created

    templateId: {
        type: mongoose.Types.ObjectId,
        ref: 'SlotTemplate'
    },

    date: {
        type: Date,
        required: true
    },

    isPublished: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
})

slotGroupSchema.virtual('slots', {
    ref: 'Slot',
    localField: '_id',
    foreignField: 'slotGroup',
    justOne: false
})
slotGroupSchema.set('toObject', { virtuals: true });
slotGroupSchema.set('toJSON', { virtuals: true });

module.exports = SlotGroup = mongoose.model('SlotGroup', slotGroupSchema)