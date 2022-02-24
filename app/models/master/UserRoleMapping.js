const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userRoleSchema = new Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
        unique: true
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
        unique: true
    }],
    CountryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country'                          
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business'
    },
    medicalCenterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MedicalCenter'                    
    },
    stationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station'                    
    },
    serviceCounterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceCounter'                    
    }


}, {
    timestamps: true
})

module.exports = UserRoleMapping = mongoose.model('UserRoleMapping', userRoleSchema)